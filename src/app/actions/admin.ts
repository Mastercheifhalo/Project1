'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';

async function requireAdmin() {
    const session = await auth();
    if (!session?.user) throw new Error('Not authenticated');
    if ((session.user as any).role !== 'ADMIN') throw new Error('Forbidden');
    return session;
}

export async function getAdminOverviewStats() {
    await requireAdmin();

    const [totalUsers, totalCourses, totalEnrollments, totalPayments] = await Promise.all([
        prisma.user.count(),
        prisma.course.count(),
        prisma.enrollment.count(),
        prisma.payment.count(),
    ]);

    // Revenue from confirmed payments
    const payments = await prisma.payment.findMany({
        where: { status: 'CONFIRMED' },
        select: { amount: true },
    });
    const totalRevenue = payments.reduce((sum: number, p: { amount: number }) => sum + p.amount, 0);

    // Recent enrollments (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentEnrollments = await prisma.enrollment.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
    });

    return {
        totalUsers,
        totalCourses,
        totalEnrollments,
        totalRevenue,
        recentEnrollments,
        totalPayments,
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
            createdAt: true,
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
        enrollments: u._count.enrollments,
        joined: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(u.createdAt),
    }));
}

export async function getAdminRevenue() {
    await requireAdmin();

    const payments = await prisma.payment.findMany({
        include: {
            user: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
    });

    return payments.map((p: any) => ({
        id: p.id,
        userName: p.user?.name || 'Unknown',
        userEmail: p.user?.email || '—',
        amount: p.amount,
        currency: p.currency,
        method: p.method,
        coin: p.coin,
        plan: p.plan,
        status: p.status,
        date: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(p.createdAt),
    }));
}

export async function getAdminCourses() {
    await requireAdmin();

    const courses = await prisma.course.findMany({
        include: {
            _count: { select: { enrollments: true, lessons: true } },
            createdBy: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
    });

    return courses.map(c => ({
        id: c.id,
        title: c.title,
        slug: (c as any).slug ?? '',
        category: (c as any).category ?? 'Development',
        level: (c as any).level ?? 'Beginner',
        published: (c as any).published ?? false,
        price: c.price,
        enrollments: c._count.enrollments,
        lessons: c._count.lessons,
        createdBy: c.createdBy?.name || 'Admin',
    }));
}

export async function createCourse(data: {
    title: string;
    description?: string;
    category: string;
    level: string;
    price: number;
}) {
    const session = await requireAdmin();
    const userId = (session.user as any).id;

    // Generate slug from title
    const slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

    const course = await prisma.course.create({
        data: {
            title: data.title,
            slug: `${slug}-${Date.now()}`,
            description: data.description || null,
            category: data.category,
            level: data.level,
            price: data.price,
            published: false,
            createdById: userId,
        },
    });

    return { success: true, courseId: course.id, slug: course.slug };
}

export async function deleteCourse(courseId: string) {
    await requireAdmin();

    await prisma.course.delete({ where: { id: courseId } });
    return { success: true };
}

export async function toggleCoursePublished(courseId: string, published: boolean) {
    await requireAdmin();

    await prisma.course.update({
        where: { id: courseId },
        data: { published },
    });
    return { success: true };
}
