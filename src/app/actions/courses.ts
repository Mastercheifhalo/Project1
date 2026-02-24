'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';

// ─── Access Control ───────────────────────────────────────────────────────────

/**
 * Determines whether the current user can access a given lesson.
 * Returns: "free" | "subscribed" | "purchased" | "locked"
 *
 * Rules (in order):
 *  1. Lesson is marked isFree → always accessible
 *  2. User has an active Subscription → full access
 *  3. User has an Enrollment for the lesson's course → one-time purchase access
 *  4. Otherwise → locked (show paywall)
 */
export async function canAccessLesson(lessonId: string): Promise<'free' | 'subscribed' | 'purchased' | 'locked'> {
    const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: { isFree: true, courseId: true },
    });

    if (!lesson) return 'locked';
    if (lesson.isFree) return 'free';

    const session = await auth();
    if (!session?.user) return 'locked';
    const userId = session.user.id;

    // Zero-Trust: Check user status directly from DB to catch real-time suspension
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { status: true },
    });

    if (!user || user.status === 'SUSPENDED') {
        console.log(`[Access Control] Denying access to suspended or missing user: ${userId}`);
        return 'locked';
    }

    // Check active subscription
    const subscription = await prisma.subscription.findFirst({
        where: { userId, status: 'ACTIVE' },
    });
    if (subscription) return 'subscribed';

    // Check per-course enrollment (one-time purchase)
    const enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId: lesson.courseId } },
    });
    if (enrollment && enrollment.status === 'ACTIVE') return 'purchased';

    return 'locked';
}

// ─── Course Detail ────────────────────────────────────────────────────────────

export async function getCourseBySlug(slug: string) {
    const course = await prisma.course.findUnique({
        where: { slug },
        include: {
            lessons: {
                select: { id: true, title: true, duration: true, order: true, isFree: true } as any,
                orderBy: { order: 'asc' },
            },
            createdBy: {
                select: { name: true, image: true },
            },
            _count: {
                select: { enrollments: true },
            },
        },
    });

    if (!course) return null;

    // Check if current user is enrolled (subscription or per-course purchase)
    const session = await auth();
    let isEnrolled = false;
    let hasSubscription = false;

    if (session?.user) {
        const userId = session.user.id;
        const [enrollment, subscription] = await Promise.all([
            prisma.enrollment.findUnique({
                where: { userId_courseId: { userId, courseId: course.id } },
            }),
            prisma.subscription.findFirst({
                where: { userId, status: 'ACTIVE' },
            }),
        ]);
        isEnrolled = !!enrollment;
        hasSubscription = !!subscription;
    }

    // User "has access" if enrolled OR subscribed
    const hasAccess = isEnrolled || hasSubscription;

    return {
        id: course.id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        thumbnail: course.thumbnail,
        category: course.category,
        level: course.level,
        price: course.price,
        published: course.published,
        createdBy: (course as any).createdBy,
        enrollmentCount: (course as any)._count.enrollments,
        isEnrolled: hasAccess,
        lessons: (course as any).lessons.map((l: any) => ({
            id: l.id,
            title: l.title,
            duration: l.duration,
            order: l.order,
            isFree: l.isFree,
        })),
    };
}

// ─── Course Catalog ───────────────────────────────────────────────────────────

export async function getAllPublishedCourses() {
    const courses = await prisma.course.findMany({
        where: { published: true },
        include: {
            lessons: {
                select: { id: true, duration: true, isFree: true } as any,
            },
            _count: {
                select: { enrollments: true },
            },
        },
        orderBy: { createdAt: 'desc' },
    });

    return courses.map(course => ({
        id: course.id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        thumbnail: course.thumbnail,
        category: course.category,
        level: course.level,
        price: course.price,
        lessonCount: course.lessons.length,
        hasFreeLesson: (course as any).lessons.some((l: any) => l.isFree),
        totalDuration: (course as any).lessons.reduce((sum: number, l: any) => sum + (l.duration || 0), 0),
        enrollmentCount: (course as any)._count.enrollments,
    }));
}

// ─── Lesson Detail ────────────────────────────────────────────────────────────

export async function getLessonById(lessonId: string) {
    const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
            course: {
                include: {
                    lessons: {
                        select: { id: true, title: true, order: true },
                        orderBy: { order: 'asc' },
                    },
                },
            },
        },
    });

    if (!lesson) return null;

    const lessons = lesson.course.lessons;
    const currentIndex = lessons.findIndex(l => l.id === lessonId);
    const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

    return {
        id: lesson.id,
        title: lesson.title,
        content: lesson.content,
        videoUrl: lesson.videoUrl,
        duration: lesson.duration,
        order: lesson.order,
        isFree: (lesson as any).isFree,
        course: {
            id: lesson.course.id,
            title: lesson.course.title,
            slug: lesson.course.slug,
        },
        prevLesson,
        nextLesson,
    };
}

// ─── Enrollment ───────────────────────────────────────────────────────────────

export async function enrollInCourse(courseId: string) {
    const session = await auth();
    if (!session?.user) return { error: 'Not authenticated' };

    const userId = session.user.id;

    // Check if already enrolled
    const existing = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId } },
    });

    if (existing) return { error: 'Already enrolled' };

    await prisma.enrollment.create({
        data: { userId, courseId },
    });

    return { success: true };
}
