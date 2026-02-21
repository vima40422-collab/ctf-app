const admin = require('firebase-admin');

const serviceAccount = {
  "type": "service_account",
  "project_id": "itetude-ce41d",
  "private_key_id": "62c6d464583eeba03a86a491eb3c09f6d186dcde",
  "private_key": process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  "client_email": "firebase-adminsdk-fbsvc@itetude-ce41d.iam.gserviceaccount.com"
};

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

async function init() {
    // Créer un challenge test
    await db.collection('challenges').add({
        name: "Challenge Test",
        flagHash: "9f86d081884c7d6592feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08", // "test"
        points: 10,
        active: true
    });
    
    // Créer un participant test
    await db.collection('participants').doc('testuser').set({
        name: "Test User",
        points: 42,
        solved: []
    });
    
    console.log("✅ Collections créées !");
}

init().catch(console.error);