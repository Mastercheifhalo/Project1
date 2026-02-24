const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
const db = new Database(dbPath);

console.log("Checking for ADMIN users directly in dev.db...");
try {
    const row = db.prepare("SELECT email, name, role FROM User WHERE role = 'ADMIN'").all();
    console.log("Admins found:", JSON.stringify(row, null, 2));
} catch (err) {
    console.error("Direct DB error:", err.message);
} finally {
    db.close();
}
