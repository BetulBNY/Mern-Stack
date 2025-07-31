// 1. Gerekli Paketleri Import Etme
// ------------------------------------
require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

// 2. Express Uygulamasını ve Sabitleri Oluşturma
// ------------------------------------
const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = "";

if (!MONGO_URI) {
  console.error("Hata: MONGO_URI environment değişkeni bulunamadı. Lütfen .env dosyanızı kontrol edin.");
  process.exit(1);
}

// 3. Middleware'leri Ayarlama
// ------------------------------------
app.use(cors());
app.use(express.json());
app.get('/favicon.ico', (req, res) => res.status(204).send());

// 4. Veritabanı Bağlantısı
// ------------------------------------
const client = new MongoClient(MONGO_URI);
let db;

async function connectToDb() {
  try {
    await client.connect();
    db = client.db('cms_project'); // Veritabanı adınız
    console.log('MongoDB veritabanına başarıyla bağlanıldı!');
  } catch (err) {
    console.error('MongoDB bağlantısı başarısız oldu:', err);
    process.exit(1);
  }
}

// 5. API Rotaları (Endpoints)
// ------------------------------------

// Ana Rota
app.get('/', (req, res) => {
  res.json({ message: 'CMS API\'sine hoş geldiniz. (Akıllı Bileşen Mimarisi)' });
});

// GET -> Belirli bir sayfanın iskeletini/yapısını getir
app.get('/api/pages/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const page = await db.collection('pages').findOne({ slug: slug });

    if (page) {
      res.status(200).json(page);
    } else {
      res.status(404).json({ message: 'Sayfa bulunamadı' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err });
  }
});

// GET -> content_items koleksiyonundaki öğeleri getir (kategoriye göre filtreleme imkanıyla)
app.get('/api/content_items', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    const items = await db.collection('content_items').find(filter).toArray();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: 'İçerik öğeleri getirilemedi', error: err });
  }
});

// POST -> content_items koleksiyonuna yeni bir öğe ekle
app.post('/api/content_items', async (req, res) => {
  try {
    const newItemData = req.body;
    newItemData.created_at = new Date();

    const result = await db.collection('content_items').insertOne(newItemData);
    const newDocument = { ...newItemData, _id: result.insertedId };
    
    res.status(201).json(newDocument);
  } catch (err) {
    console.error("İçerik öğesi oluşturulamadı:", err);
    res.status(500).json({ message: 'İçerik öğesi oluşturulamadı' });
  }
});

// 6. Sunucuyu Başlatma
// ------------------------------------
connectToDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
  });
});