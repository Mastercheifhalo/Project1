import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';

// Using standard constructor - Prisma 7 should pick up the connection from the environment
// in a standard seeding flow (npx prisma db seed).
const prisma = new PrismaClient();

async function main() {
    console.log("Seeding Neon database...");

    // 1. Create Admin
    const adminEmail = 'admin@coursepro.com';
    const adminPassword = 'AdminPassword123!';
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.user.upsert({
        where: { email: adminEmail },
        update: { role: 'ADMIN', status: 'ACTIVE' },
        create: {
            email: adminEmail,
            name: 'Super Admin',
            password: hashedAdminPassword,
            role: 'ADMIN',
            status: 'ACTIVE',
        },
    });

    // 2. Create Test User
    const studentEmail = 'student@coursepro.com';
    const studentPassword = 'StudentPassword123!';
    const hashedStudentPassword = await bcrypt.hash(studentPassword, 10);

    await prisma.user.upsert({
        where: { email: studentEmail },
        update: { role: 'STUDENT', status: 'ACTIVE' },
        create: {
            email: studentEmail,
            name: 'Test Student',
            password: hashedStudentPassword,
            role: 'STUDENT',
            status: 'ACTIVE',
        },
    });

    console.log('Seed successful:');
    console.log('Admin:', adminEmail);
    console.log('Student:', studentEmail);
}

main()
    .catch((e) => {
        console.error("Seeding error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
