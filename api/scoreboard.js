import { db } from '../../firebase.js';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const snapshot = await db.collection('participants').get();
        
        const participants = snapshot.docs.map(doc => ({
            name: doc.data().name,
            points: doc.data().points || 0,
            solved: doc.data().solved || []
        }));

        // Sort by points descending
        participants.sort((a, b) => b.points - a.points);

        return res.status(200).json(participants);

    } catch (error) {
        console.error('Error fetching scoreboard:', error);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}