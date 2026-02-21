import crypto from 'crypto';
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
    
    const { name, challenge, flag } = req.body;
    if (!name || !challenge || !flag) {
        return res.status(400).json({ error: 'Champs requis' });
    }
    
    try {
        const challengeDoc = await db.collection('challenges').doc(challenge).get();
        if (!challengeDoc.exists) return res.status(400).json({ error: 'Challenge inexistant' });
        
        const challengeData = challengeDoc.data();
        const hash = crypto.createHash('sha256').update(flag).digest('hex');
        
        if (hash !== challengeData.flagHash) {
            return res.status(401).json({ error: 'Flag incorrect' });
        }
        
        const participantRef = db.collection('participants').doc(name);
        const participantDoc = await participantRef.get();
        
        if (!participantDoc.exists) {
            await participantRef.set({
                name, points: challengeData.points, solved: [challenge]
            });
        } else {
            const pdata = participantDoc.data();
            if (pdata.solved?.includes(challenge)) {
                return res.status(400).json({ error: 'Déjà résolu' });
            }
            await participantRef.update({
                points: (pdata.points || 0) + challengeData.points,
                solved: [...(pdata.solved || []), challenge]
            });
        }
        
        res.json({ success: true, points: challengeData.points });
    } catch {
        res.status(500).json({ error: 'Erreur serveur' });
    }
}