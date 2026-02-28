import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@coursepro.com';
    const password = 'AdminPassword123!';
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.upsert({
        where: { email },
        update: {
            role: 'ADMIN',
        },
        create: {
            email,
            name: 'Super Admin',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    console.log('Admin account created/updated successfully:');
    console.log('Email:', email);
    console.log('Password:', password);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
