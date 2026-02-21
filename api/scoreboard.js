import admin from 'firebase-admin';

// Initialisation Firebase simplifiée
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: "itetude-ce41d",
                clientEmail: "firebase-adminsdk-fbsvc@itetude-ce41d.iam.gserviceaccount.com",
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
            })
        });
    } catch (e) {}
}

const db = admin.firestore();

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    try {
        const snapshot = await db.collection('participants').get();
        const participants = [];
        
        snapshot.forEach(doc => participants.push(doc.data()));
        participants.sort((a, b) => (b.points || 0) - (a.points || 0));
        
        res.status(200).json(participants);
    } catch {
        res.status(200).json([]); // Retourne tableau vide en cas d'erreur
    }
}