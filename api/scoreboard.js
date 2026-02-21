// /api/scoreboard.js - VERSION DE TEST ULTRA-SIMPLE
import { db } from '../../firebase.js';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Test simple pour voir si l'API répond
    console.log('✅ API scoreboard appelée');
    
    try {
        // 1. Vérifier que db existe
        if (!db) {
            console.error('❌ db est undefined');
            return res.status(500).json({ error: 'Database not initialized' });
        }

        // 2. Essayer de se connecter à Firestore
        console.log('📦 Tentative de connexion à Firestore...');
        
        // 3. Requête simple
        const participantsRef = db.collection('participants');
        const snapshot = await participantsRef.limit(1).get();
        
        console.log(`📊 Collection participants accessible, taille: ${snapshot.size}`);
        
        // 4. Récupérer tous les participants
        const allParticipants = await participantsRef.get();
        const participants = [];
        
        allParticipants.forEach(doc => {
            const data = doc.data();
            participants.push({
                name: data.name || 'Anonyme',
                points: data.points || 0,
                solved: data.solved || []
            });
        });

        // 5. Trier
        participants.sort((a, b) => b.points - a.points);

        console.log(`✅ Renvoi de ${participants.length} participants`);
        return res.status(200).json(participants);

    } catch (error) {
        // Capture détaillée de l'erreur
        console.error('❌ ERREUR DANS L\'API:');
        console.error('Nom:', error.name);
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        
        return res.status(500).json({ 
            error: 'Erreur serveur',
            name: error.name,
            message: error.message,
            stack: error.stack 
        });
    }
}