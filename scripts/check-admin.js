const prisma = require('./prisma-client');

async function check() {
    try {
        console.log("Checking for ADMIN users in local database...");
        const admins = await prisma.user.findMany({
            where: { role: 'ADMIN' },
            select: { email: true, name: true, role: true }
        });
        console.log("Admins found:", JSON.stringify(admins, null, 2));
    } catch (err) {
        console.log("Database check failed:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}

check();
