import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const config = {
    api: {
        bodyParser: false, // Disabling body parser for custom handling if needed, but for small/medium files Next.js supports standard FormData
    },
};

export async function POST(req: NextRequest) {
    // 1. Auth & Admin Authorization Check
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // 2. Validate file type (Video only)
        if (!file.type.startsWith('video/')) {
            return NextResponse.json({ error: 'Only video files are allowed' }, { status: 400 });
        }

        // 3. Prepare storage
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
        
        // Ensure directory exists (just in case)
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Directory might already exist
        }

        const extension = path.extname(file.name) || '.mp4';
        const fileName = `${uuidv4()}${extension}`;
        const filePath = path.join(uploadDir, fileName);

        // 4. Save to disk
        await writeFile(filePath, buffer);

        // 5. Return the public URL
        const publicUrl = `/uploads/videos/${fileName}`;
        
        return NextResponse.json({ 
            success: true, 
            url: publicUrl,
            name: file.name
        });

    } catch (error: any) {
        console.error('[Video Upload Error]:', error);
        return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
    }
}
