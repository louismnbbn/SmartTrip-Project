const express = require('express');
const admin = require('firebase-admin');

// Inisialisasi Express
const app = express();
app.use(express.json()); // Middleware untuk parsing JSON

const cors = require('cors');
app.use(cors());

// Inisialisasi Firebase Admin SDK
const serviceAccount = require('./smarttrip-76503-firebase-adminsdk-qco4s-258923bae1.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smarttrip-76503.firebaseio.com"
});
const db = admin.firestore();

// Endpoint Utama
app.get('/', (req, res) => {
  res.send('Welcome to SmartTrip Backend API!');
});

// Endpoint untuk Mendapatkan Data Destinations
app.get('/destinations', async (req, res) => {
  try {
    const snapshot = await db.collection('destinations').get();
    if (snapshot.empty) {
      return res.status(404).send({ message: 'No destinations found' });
    }
    const destinations = snapshot.docs.map(doc => doc.data());
    res.status(200).json(destinations); // Respons dalam format JSON
  } catch (error) {
    res.status(500).send({ message: 'Error retrieving destinations', error: error.message });
  }
});

// Endpoint Mendapatkan Detail Destinasi Berdasarkan ID
app.get('/destinations/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await db.collection('destinations').doc(id).get();

    if (!doc.exists) {
      return res.status(404).send({ message: 'Destination not found' });
    }

    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).send({ message: 'Error retrieving destination', error: error.message });
  }
});

// Jalankan Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
