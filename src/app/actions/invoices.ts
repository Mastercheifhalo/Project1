'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

/**
 * Generates an invoice for a confirmed payment.
 */
export async function generateInvoice(paymentId: string) {
    const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: { user: true, course: true }
    });

    if (!payment) throw new Error('Payment not found');
    if (payment.status !== 'CONFIRMED') throw new Error('Cannot generate invoice for unconfirmed payment');

    // Create a unique invoice number: INV-YEAR-PAYMENTID_SUFFIX
    const year = new Date().getFullYear();
    const suffix = paymentId.slice(-6).toUpperCase();
    const invoiceNumber = `INV-${year}-${suffix}`;

    // Upsert to handle accidental double calls
    const invoice = await prisma.invoice.upsert({
        where: { paymentId },
        update: {
            amount: payment.amount,
            status: 'PAID',
        },
        create: {
            invoiceNumber,
            userId: payment.userId,
            paymentId: payment.id,
            amount: payment.amount,
            status: 'PAID',
        }
    });

    return invoice;
}

/**
 * Fetches all invoices for the currently logged-in student.
 */
export async function getUserInvoices() {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Unauthorized');

    const invoices = await prisma.invoice.findMany({
        where: { userId: session.user.id },
        include: {
            payment: {
                include: {
                    course: { select: { title: true } }
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return invoices.map((inv: any) => ({
        id: inv.id,
        number: inv.invoiceNumber,
        amount: inv.amount,
        status: inv.status,
        date: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(inv.createdAt),
        item: inv.payment.plan === 'OneTime' ? (inv.payment.course?.title || 'Course Access') : `${inv.payment.plan} Subscription`
    }));
}

/**
 * Fetches detailed invoice data for viewing.
 */
export async function getInvoiceDetails(invoiceId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Unauthorized');

    const invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: {
            user: { select: { name: true, email: true } },
            payment: {
                include: {
                    course: { select: { title: true, price: true } }
                }
            }
        }
    });

    if (!invoice) throw new Error('Invoice not found');

    // Security: Only the owner or an ADMIN can view the invoice
    if (invoice.userId !== session.user.id && session.user.role !== 'ADMIN') {
        throw new Error('Unauthorized access to invoice');
    }

    return invoice;
}
