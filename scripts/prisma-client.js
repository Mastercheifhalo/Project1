const { PrismaClient } = require('@prisma/client');
const path = require('path');

const prisma = new PrismaClient();

module.exports = prisma;
