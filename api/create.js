import { db, auth } from '../../firebase.js';

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Check authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Non autorisé' });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        // Verify the token
        const decodedToken = await auth.verifyIdToken(token);
        
        // Check if user has admin claim
        if (!decodedToken.admin) {
            return res.status(403).json({ error: 'Accès refusé - Droits admin requis' });
        }

        const { name, flagHash, points, active } = req.body;

        // Validate input
        if (!name || !flagHash || !points) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }

        // Create challenge in Firestore
        const challengeRef = db.collection('challenges').doc();
        await challengeRef.set({
            name,
            flagHash,
            points: parseInt(points),
            active: active || false,
            createdAt: new Date().toISOString()
        });

        return res.status(200).json({ 
            success: true, 
            id: challengeRef.id,
            message: 'Challenge créé avec succès'
        });

    } catch (error) {
        console.error('Error creating challenge:', error);
        return res.status(500).json({ error: 'Erreur serveur: ' + error.message });
    }
}