import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "prisma", "dev.db");
const adapter = new PrismaBetterSqlite3({
    url: `file:${dbPath}`
});
const prisma = new PrismaClient({ adapter });

async function main() {
    const email = 'admin@coursepro.com';
    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, role: true }
    });

    console.log('User Record:', JSON.stringify(user, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
