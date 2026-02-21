// /api/scoreboard.js
import { db } from '../../firebase.js';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log('🔍 Fetching scoreboard...');
        
        // Vérifier que db est bien initialisé
        if (!db) {
            console.error('❌ Firestore non initialisé');
            return res.status(500).json({ 
                error: 'Database not initialized',
                details: 'Firestore connection failed'
            });
        }

        // Get all participants
        const participantsRef = db.collection('participants');
        console.log('📦 Collection reference created');
        
        const snapshot = await participantsRef.get();
        console.log(`📊 Found ${snapshot.size} participants`);
        
        if (snapshot.empty) {
            console.log('📭 No participants found');
            return res.status(200).json([]);
        }
        
        const participants = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                name: data.name || 'Anonyme',
                points: typeof data.points === 'number' ? data.points : 0,
                solved: Array.isArray(data.solved) ? data.solved : []
            };
        });

        // Sort by points descending
        participants.sort((a, b) => b.points - a.points);

        console.log(`✅ Successfully processed ${participants.length} participants`);
        return res.status(200).json(participants);

    } catch (error) {
        console.error('❌ Error in scoreboard API:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        // Return detailed error for debugging
        return res.status(500).json({ 
            error: 'Erreur serveur',
            message: error.message,
            name: error.name,
            time: new Date().toISOString()
        });
    }
}