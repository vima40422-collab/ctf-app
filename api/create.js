import admin from 'firebase-admin';

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: "itetude-ce41d",
            clientEmail: "firebase-adminsdk-fbsvc@itetude-ce41d.iam.gserviceaccount.com",
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
        })
    });
}

const db = admin.firestore();

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Non autorisé' });
    
    try {
        const { name, flagHash, points, active } = req.body;
        
        await db.collection('challenges').add({
            name, flagHash, points: parseInt(points), active: active || false
        });
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}