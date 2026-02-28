'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

/**
 * Saves or updates lesson progress for the current user.
 */
export async function saveProgress(lessonId: string, watchedSecs: number, completed: boolean = false) {
    const session = await auth();
    if (!session?.user) return { error: 'Not authenticated' };

    const userId = session.user.id;

    try {
        await prisma.lessonProgress.upsert({
            where: {
                userId_lessonId: { userId, lessonId },
            },
            update: {
                watchedSecs,
                completed,
            },
            create: {
                userId,
                lessonId,
                watchedSecs,
                completed,
            },
        });

        // Update the enrollment record's updatedAt timestamp to reflect activity
        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            select: { courseId: true }
        });

        if (lesson) {
            await prisma.enrollment.update({
                where: {
                    userId_courseId: { userId, courseId: lesson.courseId }
                },
                data: { updatedAt: new Date() }
            });
        }

        return { success: true };
    } catch {
        return { error: 'Failed to save progress' };
    }
}

/**
 * Retrieves progress for a specific lesson for the current user.
 */
export async function getLessonProgress(lessonId: string) {
    const session = await auth();
    if (!session?.user) return null;

    const userId = session.user.id;

    return await prisma.lessonProgress.findUnique({
        where: {
            userId_lessonId: { userId, lessonId },
        },
    });
}

/**
 * Marks a lesson as completed.
 */
export async function completeLesson(lessonId: string) {
    const session = await auth();
    if (!session?.user) return { error: 'Not authenticated' };

    const userId = session.user.id;

    try {
        await prisma.lessonProgress.upsert({
            where: {
                userId_lessonId: { userId, lessonId },
            },
            update: {
                completed: true,
            },
            create: {
                userId,
                lessonId,
                completed: true,
                watchedSecs: 0, // Should ideally be filled by the total duration
            },
        });

        revalidatePath('/dashboard');
        revalidatePath('/dashboard/my-courses');

        return { success: true };
    } catch {
        return { error: 'Failed to complete lesson' };
    }
}
