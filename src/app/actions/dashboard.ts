'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function getDashboardStats() {
    const session = await auth();
    if (!session?.user) return null;

    const userId = (session.user as any).id;

    // Fetch stats and last active enrollment in parallel
    const [completedCount, activeCount, totalEnrollments, lastActiveEnrollment] = await Promise.all([
        prisma.enrollment.count({
            where: { userId, status: 'COMPLETED' },
        }),
        prisma.enrollment.count({
            where: { userId, status: 'ACTIVE' },
        }),
        prisma.enrollment.count({
            where: { userId },
        }),
        prisma.enrollment.findFirst({
            where: { userId, status: 'ACTIVE' },
            include: {
                course: {
                    include: {
                        lessons: {
                            orderBy: { order: 'asc' },
                            take: 1
                        }
                    }
                }
            },
            orderBy: { updatedAt: 'desc' },
        })
    ]);

    // Calculate total hours from completed lesson progress
    const lessonProgress = await prisma.lessonProgress.findMany({
        where: { userId },
        select: { watchedSecs: true },
    });
    const totalHours = Math.round(
        lessonProgress.reduce((sum: number, lp: { watchedSecs: number }) => sum + lp.watchedSecs, 0) / 3600
    );

    return {
        userName: session.user.name || 'Student',
        completedCourses: completedCount,
        activeCourses: activeCount,
        totalEnrollments,
        totalHours,
        activeSession: lastActiveEnrollment ? {
            courseTitle: lastActiveEnrollment.course.title,
            courseSlug: lastActiveEnrollment.course.slug,
            lessonTitle: lastActiveEnrollment.course.lessons[0]?.title || 'Intro',
            lessonVideoUrl: lastActiveEnrollment.course.lessons[0]?.videoUrl,
            thumbnail: lastActiveEnrollment.course.thumbnail,
        } : null
    };
}

export async function getMyCoursesData() {
    const session = await auth();
    if (!session?.user) return [];

    const userId = (session.user as any).id;

    const enrollments = await prisma.enrollment.findMany({
        where: { userId },
        include: {
            course: {
                include: {
                    lessons: {
                        select: { id: true, title: true, duration: true },
                        orderBy: { order: 'asc' },
                    },
                },
            },
        },
        orderBy: { updatedAt: 'desc' },
    });

    // Get lesson progress for all enrolled courses
    const courseIds = enrollments.map(e => e.course.id);
    const allLessons = enrollments.flatMap(e => e.course.lessons);
    const lessonIds = allLessons.map(l => l.id);

    const progressRecords = await prisma.lessonProgress.findMany({
        where: {
            userId,
            lessonId: { in: lessonIds },
        },
    });

    const progressMap = new Map<string, { completed: boolean; watchedSecs: number }>(progressRecords.map((p: any) => [p.lessonId, p]));

    return enrollments.map(enrollment => {
        const totalLessons = enrollment.course.lessons.length;
        const completedLessons = enrollment.course.lessons.filter(
            l => progressMap.get(l.id)?.completed
        ).length;
        const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        // Calculate remaining duration
        const totalDurationSecs = enrollment.course.lessons.reduce(
            (sum, l) => sum + (l.duration || 0), 0
        );
        const watchedSecs = enrollment.course.lessons.reduce(
            (sum, l) => sum + (progressMap.get(l.id)?.watchedSecs || 0), 0
        );
        const remainingSecs = Math.max(0, totalDurationSecs - watchedSecs);
        const remainingHours = Math.floor(remainingSecs / 3600);
        const remainingMins = Math.floor((remainingSecs % 3600) / 60);

        const duration = progress === 100
            ? 'Completed'
            : remainingHours > 0
                ? `${remainingHours}h ${remainingMins}m left`
                : `${remainingMins}m left`;

        return {
            id: enrollment.course.id,
            slug: enrollment.course.slug,
            title: enrollment.course.title,
            thumbnail: enrollment.course.thumbnail || '/placeholder-course.jpg',
            progress,
            completedLessons,
            totalLessons,
            lessons: `${completedLessons}/${totalLessons}`,
            duration,
            status: enrollment.status,
        };
    });
}

export async function getUserProfile() {
    const session = await auth();
    if (!session?.user) return null;

    const userId = (session.user as any).id;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
        },
    });

    const subscription = await prisma.subscription.findFirst({
        where: { userId, status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' },
    });

    return {
        ...user,
        plan: subscription?.plan || 'Free',
        memberSince: user?.createdAt
            ? new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(user.createdAt)
            : 'N/A',
    };
}

export async function updateUserProfile(formData: FormData) {
    const session = await auth();
    if (!session?.user) return { error: 'Not authenticated' };

    const userId = (session.user as any).id;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    if (!name || !email) {
        return { error: 'Name and email are required' };
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { name, email },
        });
        return { success: true };
    } catch (error: any) {
        if (error.code === 'P2002') {
            return { error: 'Email already in use' };
        }
        return { error: 'Failed to update profile' };
    }
}

export async function deleteAccount() {
    const session = await auth();
    if (!session?.user) return { error: 'Not authenticated' };

    const userId = (session.user as any).id;

    try {
        await prisma.user.delete({
            where: { id: userId },
        });
        return { success: true };
    } catch (error) {
        return { error: 'Failed to delete account' };
    }
}
