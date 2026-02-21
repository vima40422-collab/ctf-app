// /firebase.js - VERSION SIMPLIFIÉE
import admin from 'firebase-admin';

console.log('🔥 Initialisation Firebase Admin...');
console.log('Variables d\'environnement:');
console.log('- PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? '✅' : '❌');
console.log('- CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? '✅' : '❌');
console.log('- PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? '✅' : '❌');

if (!admin.apps.length) {
    try {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
        
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: privateKey,
            }),
        });
        
        console.log('✅ Firebase Admin initialisé avec succès');
    } catch (error) {
        console.error('❌ Erreur initialisation Firebase:', error);
    }
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };