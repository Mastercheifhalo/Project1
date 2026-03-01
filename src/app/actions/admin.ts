'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { generateInvoice } from './invoices';

/**
 * Ensures the current user is an specialized ADMIN.
 */
async function requireAdmin() {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        throw new Error('Unauthorized. Admin access required.');
    }
    return session.user.id;
}

/**
 * Internal helper to log administrative actions.
 */
async function logAudit(adminId: string, action: string, details?: any) {
    try {
        await prisma.auditLog.create({
            data: {
                adminId,
                action,
                details: details ? JSON.stringify(details) : null,
            },
        });
    } catch (error) {
        console.error('Failed to log audit:', error);
    }
}

// ─── Utility Helpers ─────────────────────────────────────────────────────────

export async function generateSlug(text: string): Promise<string> {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
}

export async function getAdminOverviewStats() {
    await requireAdmin();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [userCount, courseCount, enrollmentCount, recentEnrollments, payments] = await Promise.all([
        prisma.user.count(),
        prisma.course.count(),
        prisma.enrollment.count(),
        prisma.enrollment.count({
            where: { createdAt: { gte: thirtyDaysAgo } }
        }),
        prisma.payment.findMany({
            where: { status: 'CONFIRMED' },
            select: { amount: true }
        }),
    ]);

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    return {
        totalUsers: userCount,
        totalCourses: courseCount,
        totalEnrollments: enrollmentCount,
        recentEnrollments: recentEnrollments,
        totalRevenue: totalRevenue,
        totalPayments: payments.length
    };
}

export async function getAdminUsers() {
    await requireAdmin();

    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            subscriptions: {
                where: { status: 'ACTIVE' },
                select: { plan: true },
                take: 1,
            },
            _count: {
                select: { enrollments: true },
            },
        },
        orderBy: { createdAt: 'desc' },
    });

    return users.map((u: any) => ({
        id: u.id,
        name: u.name || 'Unnamed',
        email: u.email || '—',
        role: u.role,
        status: u.status || 'ACTIVE',
        plan: u.subscriptions[0]?.plan || 'Free',
        enrollments: u._count.enrollments,
        joined: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(u.createdAt),
    }));
}

export async function getUserAccessDetails(userId: string) {
    await requireAdmin();
    const enrollments = await prisma.enrollment.findMany({
        where: { userId, status: 'ACTIVE' },
        include: { course: { select: { id: true, title: true } } },
    });
    return enrollments.map(e => ({
        courseId: e.courseId,
        courseTitle: e.course.title,
    }));
}

export async function getAllCoursesMinimal() {
    await requireAdmin();
    return await prisma.course.findMany({
        select: { id: true, title: true, slug: true },
        orderBy: { title: 'asc' },
    });
}

/**
 * Fetches all payments, especially PENDING ones for manual verification.
 * Also serves the Revenue page.
 */
export async function getAdminRevenue() {
    await requireAdmin();

    const payments = await prisma.payment.findMany({
        include: {
            user: { select: { name: true, email: true } },
            course: { select: { title: true } },
        },
        orderBy: { createdAt: 'desc' },
    });

    return payments.map((p: any) => ({
        id: p.id,
        userName: p.user.name || 'Unnamed',
        userEmail: p.user.email || '—',
        amount: p.amount,
        currency: p.currency,
        method: p.method,
        coin: p.coin,
        plan: p.plan || (p.course ? 'One-Time' : 'Subscription'),
        status: p.status,
        screenshot: p.screenshot,
        date: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(p.createdAt),
    }));
}

export async function getRevenueChartData(days: number = 30) {
    await requireAdmin();

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const payments = await prisma.payment.findMany({
        where: {
            status: 'CONFIRMED',
            createdAt: { gte: startDate },
        },
        select: {
            amount: true,
            createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
    });

    // Group by day
    const chartData: Record<string, number> = {};

    // Fill in all days even if 0 revenue
    for (let i = 0; i < days; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        chartData[label] = 0;
    }

    payments.forEach(p => {
        const label = p.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (chartData[label] !== undefined) {
            chartData[label] += p.amount;
        }
    });

    return Object.entries(chartData)
        .map(([date, revenue]) => ({ date, revenue }))
        .reverse(); // Ensure chronological order
}

export async function getAuditLogs() {
    await requireAdmin();
    const logs = await prisma.auditLog.findMany({
        include: {
            admin: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 100, // Limit for performance
    });

    return logs.map((l: any) => ({
        id: l.id,
        adminName: l.admin.name || 'Admin',
        adminEmail: l.admin.email,
        action: l.action,
        details: l.details,
        date: new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(l.createdAt),
    }));
}

export async function getAdminCourses() {
    await requireAdmin();

    const courses = await prisma.course.findMany({
        include: {
            _count: {
                select: { enrollments: true, lessons: true },
            },
            createdBy: { select: { name: true } },
        },
        orderBy: { updatedAt: 'desc' },
    });

    return courses.map((c: any) => ({
        id: c.id,
        title: c.title,
        slug: c.slug,
        category: c.category,
        level: c.level,
        published: c.published,
        price: c.price,
        enrollments: c._count.enrollments,
        lessons: c._count.lessons,
        createdBy: c.createdBy?.name || 'Admin',
    }));
}

export async function toggleCoursePublished(courseId: string, published: boolean) {
    const adminId = await requireAdmin();
    // Validate existence first
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new Error('Course not found');

    await prisma.course.update({
        where: { id: courseId },
        data: { published },
    });
    revalidatePath('/admin/courses');
    revalidatePath('/courses');

    await logAudit(adminId, published ? 'COURSE_PUBLISHED' : 'COURSE_UNPUBLISHED', {
        courseId,
        title: course.title,
    });

    return { success: true };
}

export async function getAdminCourseById(id: string) {
    await requireAdmin();
    return await prisma.course.findUnique({
        where: { id },
        include: {
            lessons: {
                orderBy: { order: 'asc' },
            },
        },
    });
}


/**
 * Activates a pending payment and its associated enrollment/subscription.
 */
export async function activatePayment(paymentId: string) {
    await requireAdmin();

    const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: { user: true },
    });

    if (!payment) throw new Error('Payment not found');
    const adminId = await requireAdmin(); // Get ID for audit

    if (payment.status === 'CONFIRMED') return { success: true, message: 'Already confirmed' };

    const { userId, plan, courseId } = payment;

    // 1. Update Payment status
    await prisma.payment.update({
        where: { id: paymentId },
        data: { status: 'CONFIRMED' },
    });

    // 2. Activate Enrollment or Subscription
    if (plan === 'OneTime' && courseId) {
        // One-time course purchase
        await prisma.enrollment.upsert({
            where: { userId_courseId: { userId, courseId } },
            update: { status: 'ACTIVE' },
            create: { userId, courseId, status: 'ACTIVE' },
        });
    } else if (plan && ['Monthly', 'Quarterly', 'Annual'].includes(plan)) {
        // Find the pending subscription for this user
        const pendingSub = await prisma.subscription.findFirst({
            where: { userId, status: 'PENDING', plan },
            orderBy: { createdAt: 'desc' },
        });

        if (pendingSub) {
            await prisma.subscription.update({
                where: { id: pendingSub.id },
                data: { status: 'ACTIVE' },
            });
        } else {
            // Create a new subscription if no pending one is found
            const now = new Date();
            const endDate = new Date();
            if (plan === 'Monthly') endDate.setMonth(now.getMonth() + 1);
            else if (plan === 'Quarterly') endDate.setMonth(now.getMonth() + 3);
            else if (plan === 'Annual') endDate.setFullYear(now.getFullYear() + 1);

            await prisma.subscription.create({
                data: {
                    userId,
                    plan,
                    status: 'ACTIVE',
                    startDate: now,
                    endDate,
                },
            });
        }
    } else if (courseId) {
        // Fallback for cases where plan might be null but courseId is set
        await prisma.enrollment.upsert({
            where: { userId_courseId: { userId, courseId } },
            update: { status: 'ACTIVE' },
            create: { userId, courseId, status: 'ACTIVE' },
        });
    }

    // 3. Generate Invoice
    try {
        await generateInvoice(paymentId);
    } catch {
        // Invoice generation is non-critical — payment is already confirmed
    }

    revalidatePath('/admin/revenue');
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/billing');

    await logAudit(adminId, 'PAYMENT_CONFIRMED', {
        paymentId,
        userId: payment.userId,
        plan: payment.plan
    });

    return { success: true };
}

// ─── Course Builder Actions ───────────────────────────────────────────────────

export async function createCourse(data: { title: string; slug: string; description: string; price: number; category: string; level: string }) {
    const userId = await requireAdmin();
    const course = await prisma.course.create({
        data: {
            ...data,
            createdById: userId,
        },
    });
    revalidatePath('/admin/courses');
    revalidatePath('/courses');
    return { success: true, course };
}

export async function updateCourse(id: string, data: any) {
    await requireAdmin();
    // Validate existence
    const exists = await prisma.course.findUnique({ where: { id } });
    if (!exists) throw new Error('Course not found');

    const course = await prisma.course.update({
        where: { id },
        data,
    });
    revalidatePath('/admin/courses');
    revalidatePath(`/courses/${course.slug}`);
    revalidatePath('/courses');
    return course;
}

export async function deleteCourse(id: string) {
    const adminId = await requireAdmin();
    const exists = await prisma.course.findUnique({ where: { id } });
    if (!exists) throw new Error('Course not found');

    await prisma.course.delete({ where: { id } });
    revalidatePath('/admin/courses');
    revalidatePath('/courses');

    await logAudit(adminId, 'COURSE_DELETED', { courseId: id, title: exists.title });

    return { success: true };
}

export async function createLesson(courseId: string, data: { title: string; content: string; videoUrl: string; order: number; isFree: boolean }) {
    await requireAdmin();
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new Error('Course not found');

    const lesson = await prisma.lesson.create({
        data: {
            ...data,
            courseId,
        },
    });
    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath(`/courses`);
    return lesson;
}

export async function updateLesson(id: string, data: any) {
    await requireAdmin();
    const exists = await prisma.lesson.findUnique({ where: { id } });
    if (!exists) throw new Error('Lesson not found');

    const lesson = await prisma.lesson.update({
        where: { id },
        data,
    });
    revalidatePath(`/admin/courses/${lesson.courseId}`);
    return lesson;
}

export async function deleteLesson(id: string) {
    await requireAdmin();
    const exists = await prisma.lesson.findUnique({ where: { id } });
    if (!exists) throw new Error('Lesson not found');

    const lesson = await prisma.lesson.delete({ where: { id } });
    revalidatePath(`/admin/courses/${lesson.courseId}`);
    return { success: true };
}

export async function reorderLessons(lessonIds: string[]) {
    await requireAdmin();

    if (lessonIds.length === 0) return { success: true };

    // Ownership validation — all IDs must belong to the same course
    const lessons = await prisma.lesson.findMany({
        where: { id: { in: lessonIds } },
        select: { id: true, courseId: true },
    });

    if (lessons.length !== lessonIds.length) {
        throw new Error('One or more lesson IDs are invalid.');
    }

    const courseIds = new Set(lessons.map(l => l.courseId));
    if (courseIds.size !== 1) {
        throw new Error('All lessons must belong to the same course.');
    }

    const courseId = [...courseIds][0];

    // Serial update for order
    for (let i = 0; i < lessonIds.length; i++) {
        await prisma.lesson.update({
            where: { id: lessonIds[i] },
            data: { order: i + 1 },
        });
    }

    revalidatePath(`/admin/courses/${courseId}`);

    return { success: true };
}

// ─── User Management Actions ──────────────────────────────────────────────────

export async function grantSubscription(userId: string, plan: string, durationDays: number) {
    const adminId = await requireAdmin();

    const now = new Date();
    const endDate = new Date();
    endDate.setDate(now.getDate() + durationDays);

    const subscription = await prisma.subscription.upsert({
        where: { id: userId }, // Using userId as ID for simpler check, or findFirst
        update: {
            plan,
            status: 'ACTIVE',
            startDate: now,
            endDate,
        },
        create: {
            userId,
            plan,
            status: 'ACTIVE',
            startDate: now,
            endDate,
        },
    });

    revalidatePath('/admin/users');

    await logAudit(adminId, 'SUBSCRIPTION_GRANTED', { userId, plan, durationDays });

    return { success: true, subscription };
}

// Fixed version of grantSubscription that uses findFirst since id isn't userId
export async function grantUserSubscription(userId: string, plan: string, durationDays: number) {
    const adminId = await requireAdmin();

    const now = new Date();
    const endDate = new Date();
    endDate.setDate(now.getDate() + durationDays);

    const existing = await prisma.subscription.findFirst({
        where: { userId, status: 'ACTIVE' }
    });

    let subscription;
    if (existing) {
        subscription = await prisma.subscription.update({
            where: { id: existing.id },
            data: { plan, endDate, status: 'ACTIVE' }
        });
    } else {
        subscription = await prisma.subscription.create({
            data: { userId, plan, startDate: now, endDate, status: 'ACTIVE' }
        });
    }

    revalidatePath('/admin/users');

    await logAudit(adminId, 'SUBSCRIPTION_GRANTED', { userId, plan, durationDays });

    return { success: true, subscription };
}

export async function grantCourseAccess(userId: string, courseId: string) {
    const adminId = await requireAdmin();
    const enrollment = await prisma.enrollment.upsert({
        where: { userId_courseId: { userId, courseId } },
        update: { status: 'ACTIVE' },
        create: { userId, courseId, status: 'ACTIVE' },
    });
    revalidatePath('/admin/users');

    await logAudit(adminId, 'COURSE_ACCESS_GRANTED', { userId, courseId });

    return { success: true, enrollment };
}

export async function revokeSubscription(userId: string) {
    const adminId = await requireAdmin();
    await prisma.subscription.updateMany({
        where: { userId, status: 'ACTIVE' },
        data: { status: 'CANCELLED' },
    });
    revalidatePath('/admin/users');

    await logAudit(adminId, 'SUBSCRIPTION_REVOKED', { userId });

    return { success: true };
}

export async function revokeCourseAccess(userId: string, courseId: string) {
    const adminId = await requireAdmin();
    await prisma.enrollment.update({
        where: { userId_courseId: { userId, courseId } },
        data: { status: 'CANCELLED' },
    });
    revalidatePath('/admin/users');

    await logAudit(adminId, 'COURSE_ACCESS_REVOKED', { userId, courseId });

    return { success: true };
}

export async function updateUserStatus(userId: string, status: string) {
    const adminId = await requireAdmin();
    await prisma.user.update({
        where: { id: userId },
        data: { status },
    });
    revalidatePath('/admin/users');

    await logAudit(adminId, 'USER_STATUS_UPDATED', { userId, status });

    return { success: true };
}
