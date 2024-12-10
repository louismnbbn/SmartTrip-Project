const admin = require("firebase-admin");
const xlsx = require("xlsx");
const path = require("path");

// Inisialisasi Firebase Admin
const serviceAccount = require("./smarttrip-76503-firebase-adminsdk-qco4s-258923bae1"); // Sesuaikan nama file
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smarttrip-76503.firebaseio.com" // Ganti <project-id> dengan ID proyek Firebase kamu
});

const db = admin.firestore();

// Fungsi untuk membaca file Excel dan mengunggah ke Firestore
async function uploadDatasetToFirestore() {
  try {
    // Baca file Excel
    const filePath = path.join(__dirname, "Data_1.xlsx"); // Nama file dataset kamu
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Ambil sheet pertama
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    console.log(`Jumlah data ditemukan: ${data.length}`);

    // Iterasi dan unggah data ke Firestore
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      await db.collection("destinations").add(item); // Ganti "destinations" sesuai koleksi Firestore kamu
      console.log(`Data ke-${i + 1} berhasil diunggah:`, item);
    }

    console.log("Semua data berhasil diunggah ke Firestore!");
  } catch (error) {
    console.error("Gagal mengunggah dataset:", error);
  }
}

// Jalankan fungsi
uploadDatasetToFirestore();
