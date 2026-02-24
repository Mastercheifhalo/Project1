'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

/**
 * Ensures the current user is an specialized ADMIN.
 */
async function requireAdmin() {
    const session = await auth();
    if ((session?.user as any)?.role !== 'ADMIN') {
        throw new Error('Unauthorized. Admin access required.');
    }
    return (session?.user as any).id;
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
        date: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(p.createdAt),
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
    await requireAdmin();
    await prisma.course.update({
        where: { id: courseId },
        data: { published },
    });
    revalidatePath('/admin/courses');
    revalidatePath('/courses');
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

    revalidatePath('/admin/revenue');
    revalidatePath('/dashboard');
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
    await requireAdmin();
    await prisma.course.delete({ where: { id } });
    revalidatePath('/admin/courses');
    revalidatePath('/courses');
    return { success: true };
}

export async function createLesson(courseId: string, data: { title: string; content: string; videoUrl: string; order: number; isFree: boolean }) {
    await requireAdmin();
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
    const lesson = await prisma.lesson.update({
        where: { id },
        data,
    });
    revalidatePath(`/admin/courses/${lesson.courseId}`);
    return lesson;
}

export async function deleteLesson(id: string) {
    await requireAdmin();
    const lesson = await prisma.lesson.delete({ where: { id } });
    revalidatePath(`/admin/courses/${lesson.courseId}`);
    return { success: true };
}

export async function reorderLessons(lessonIds: string[]) {
    await requireAdmin();

    // Serial update for order
    for (let i = 0; i < lessonIds.length; i++) {
        await prisma.lesson.update({
            where: { id: lessonIds[i] },
            data: { order: i + 1 },
        });
    }

    // Revalidate first lesson to be safe if courseId is available
    if (lessonIds.length > 0) {
        const first = await prisma.lesson.findUnique({ where: { id: lessonIds[0] }, select: { courseId: true } });
        if (first) revalidatePath(`/admin/courses/${first.courseId}`);
    }

    return { success: true };
}

// ─── User Management Actions ──────────────────────────────────────────────────

export async function grantSubscription(userId: string, plan: string, durationDays: number) {
    await requireAdmin();

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
    return { success: true, subscription };
}

// Fixed version of grantSubscription that uses findFirst since id isn't userId
export async function grantUserSubscription(userId: string, plan: string, durationDays: number) {
    await requireAdmin();

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
    return { success: true, subscription };
}

export async function grantCourseAccess(userId: string, courseId: string) {
    await requireAdmin();
    const enrollment = await prisma.enrollment.upsert({
        where: { userId_courseId: { userId, courseId } },
        update: { status: 'ACTIVE' },
        create: { userId, courseId, status: 'ACTIVE' },
    });
    revalidatePath('/admin/users');
    return { success: true, enrollment };
}

export async function revokeSubscription(userId: string) {
    await requireAdmin();
    await prisma.subscription.updateMany({
        where: { userId, status: 'ACTIVE' },
        data: { status: 'CANCELLED' },
    });
    revalidatePath('/admin/users');
    return { success: true };
}

export async function revokeCourseAccess(userId: string, courseId: string) {
    await requireAdmin();
    await prisma.enrollment.update({
        where: { userId_courseId: { userId, courseId } },
        data: { status: 'CANCELLED' },
    });
    revalidatePath('/admin/users');
    return { success: true };
}

export async function updateUserStatus(userId: string, status: string) {
    await requireAdmin();
    await prisma.user.update({
        where: { id: userId },
        data: { status },
    });
    revalidatePath('/admin/users');
    return { success: true };
}
