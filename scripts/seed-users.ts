import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";
import bcrypt from 'bcryptjs';

const dbPath = path.join(process.cwd(), "prisma", "dev.db");
const adapter = new PrismaBetterSqlite3({
    url: `file:${dbPath}`
});
const prisma = new PrismaClient({ adapter });

async function main() {
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
    console.log('Admin:', adminEmail, '/ AdminPassword123!');
    console.log('Student:', studentEmail, '/ StudentPassword123!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
