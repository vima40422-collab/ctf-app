import crypto from 'crypto';
import { db } from '../../firebase.js';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, challenge, flag } = req.body;

    // Validate input
    if (!name || !challenge || !flag) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    try {
        // Hash the submitted flag
        const hash = crypto.createHash('sha256').update(flag).digest('hex');

        // Get challenge from Firestore
        const challengeRef = db.collection('challenges').doc(challenge);
        const challengeDoc = await challengeRef.get();

        if (!challengeDoc.exists) {
            return res.status(400).json({ error: 'Challenge inexistant' });
        }

        const challengeData = challengeDoc.data();

        // Check if challenge is active
        if (!challengeData.active) {
            return res.status(400).json({ error: 'Challenge non actif' });
        }

        // Check if flag is correct
        if (hash !== challengeData.flagHash) {
            return res.status(401).json({ error: 'Flag incorrecte' });
        }

        // Get or create participant
        const participantRef = db.collection('participants').doc(name);
        const participantDoc = await participantRef.get();

        if (!participantDoc.exists) {
            // Create new participant
            await participantRef.set({
                name,
                points: challengeData.points,
                solved: [challenge]
            });
        } else {
            const participantData = participantDoc.data();

            // Check if already solved
            if (participantData.solved && participantData.solved.includes(challenge)) {
                return res.status(400).json({ error: 'Challenge déjà résolu' });
            }

            // Update participant
            await participantRef.update({
                points: (participantData.points || 0) + challengeData.points,
                solved: [...(participantData.solved || []), challenge]
            });
        }

        return res.status(200).json({ 
            success: true, 
            points: challengeData.points 
        });

    } catch (error) {
        console.error('Error submitting flag:', error);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}