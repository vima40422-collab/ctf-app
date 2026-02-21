// /firebase.js
import admin from 'firebase-admin';

console.log('🔥 Initializing Firebase Admin...');
console.log('Environment variables check:');
console.log('- FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? '✅ Present' : '❌ Missing');
console.log('- FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? '✅ Present' : '❌ Missing');
console.log('- FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? '✅ Present' : '❌ Missing');

if (!admin.apps.length) {
    try {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY 
            ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
            : undefined;

        console.log('📝 Private key length:', privateKey ? privateKey.length : 0);
        console.log('📝 Private key starts with:', privateKey ? privateKey.substring(0, 50) + '...' : 'undefined');

        const credential = admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey,
        });

        admin.initializeApp({
            credential: credential,
        });
        
        console.log('✅ Firebase Admin initialized successfully');
    } catch (error) {
        console.error('❌ Firebase Admin initialization error:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
    }
} else {
    console.log('✅ Firebase Admin already initialized');
}

const db = admin.firestore();
const auth = admin.auth();

console.log('📦 Firestore and Auth instances created');

export { db, auth };