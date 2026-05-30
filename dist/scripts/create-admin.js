"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const admin = require("firebase-admin");
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const ADMIN_EMAIL = 'admin@ahorros.com';
const ADMIN_PASSWORD = 'Admin123!';
async function createAdmin() {
    const auth = admin.auth();
    const db = admin.firestore();
    let uid;
    try {
        const existingUser = await auth.getUserByEmail(ADMIN_EMAIL);
        uid = existingUser.uid;
        console.log(`Usuario admin ya existe con UID: ${uid}`);
    }
    catch {
        const newUser = await auth.createUser({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            displayName: 'Administrador',
        });
        uid = newUser.uid;
        console.log(`Usuario admin creado con UID: ${uid}`);
    }
    const adminDocRef = db.collection('config').doc('admins');
    const adminDoc = await adminDocRef.get();
    let adminsFromCatalog = [];
    if (adminDoc.exists) {
        const data = adminDoc.data();
        adminsFromCatalog = (data.uids || []);
    }
    if (!adminsFromCatalog.includes(uid)) {
        adminsFromCatalog.push(uid);
    }
    await adminDocRef.set({
        uids: [...new Set(adminsFromCatalog)],
        actualizadoPor: 'script',
        actualizadoEn: new Date().toISOString(),
    });
    console.log(`UID ${uid} agregado a config/admins`);
    console.log('---');
    console.log(`Credenciales admin:`);
    console.log(`Email:    ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log(`Accede a: /admin/login`);
}
createAdmin()
    .then(() => process.exit(0))
    .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
});
//# sourceMappingURL=create-admin.js.map