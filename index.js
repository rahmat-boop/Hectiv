import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import { GoogleGenAI } from '@google/genai';

const app = express();
const upload = multer();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// **Set your default Gemini model here:**
const GEMINI_MODEL = "gemini-2.5-flash";

app.use(express.json());

// === TAMBAHKAN ENDPOINT /generate-text DI SINI (SESUAI GAMBAR image_818eca.jpg) ===
app.post('/generate-text', async (req, res) => {
  const { prompt } = req.body;

  try {
    // Penyesuaian panggilan SDK terbaru agar sesuai dengan struktur objeknya
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    res.status(200).json({ result: response.text });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
});
// =================================================================================

// ... kode endpoint /generate-text yang sebelumnya ada di sini ...

// === TAMBAHKAN ENDPOINT /generate-from-image DI SINI (SESUAI GAMBAR image6029.jpg) ===
app.post("/generate-from-image", upload.single("image"), async (req, res) => {
  const { prompt } = req.body;
  
  // Baris 1: Mengonversi file buffer dari multer ke string base64
  const base64Image = req.file.buffer.toString("base64");

  try {
    // Baris 2: Mengirimkan input gabungan teks dan gambar ke Gemini SDK terbaru
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        { text: prompt, type: "text" },
        { inlineData: { data: base64Image, mimeType: req.file.mimetype } }
      ],
    });

    // Baris 3: Mengembalikan respons sukses ke client
    res.status(200).json({ result: response.text });
  } catch (e) {
    // Baris 4: Menangani error jika terjadi masalah
    console.log(e);
    res.status(500).json({ message: e.message });
  }
});
// ====================================================================================

// ... kode endpoint /generate-from-image sebelumnya ada di sini ...

// === TAMBAHKAN ENDPOINT /generate-from-document DI SINI (SESUAI GAMBAR image_a0d5dc.jpg) ===
app.post("/generate-from-document", upload.single("document"), async (req, res) => {
  const { prompt } = req.body;
  
  // Baris 1: Mengonversi file dokumen dari multer ke string base64
  const base64Document = req.file.buffer.toString("base64");

  try {
    // Baris 2: Mengirim input multimodal dokumen + teks ke Gemini SDK
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        { text: prompt ?? "Tolong buat ringkasan dari dokumen berikut.", type: "text" },
        { inlineData: { data: base64Document, mimeType: req.file.mimetype } }
      ],
    });

    // Baris 3: Mengembalikan hasil teks analisis/ringkasan ke client
    res.status(200).json({ result: response.text });
  } catch (e) {
    // Baris 4: Menangani error jika ada kendala sistem
    console.log(e);
    res.status(500).json({ message: e.message });
  }
});
// =======================================================================================

// ... kode endpoint /generate-from-document sebelumnya ...

// === TAMBAHKAN ENDPOINT /generate-from-audio DI SINI (SESUAI GAMBAR image_a0f3a5.jpg) ===
app.post("/generate-from-audio", upload.single("audio"), async (req, res) => {
  const { prompt } = req.body;
  
  // Baris 1: Mengonversi file buffer audio dari multer ke string base64
  const base64Audio = req.file.buffer.toString("base64");

  try {
    // Baris 2: Mengirim input multimodal audio + teks ke Gemini SDK
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        { text: prompt ?? "Tolong buatkan transkrip dari rekaman berikut.", type: "text" },
        { inlineData: { data: base64Audio, mimeType: req.file.mimetype } }
      ],
    });

    // Baris 3: Mengembalikan respons hasil teks transkripsi/analisis ke client
    res.status(200).json({ result: response.text });
  } catch (e) {
    // Baris 4: Menangani error dengan status HTTP 500
    console.log(e);
    res.status(500).json({ message: e.message });
  }
});
// ====================================================================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ready on http://localhost:${PORT}`));