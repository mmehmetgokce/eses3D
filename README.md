# eses3D — 3D Baskı Ürün Vitrini & Talep Yönetim Sistemi

3D yazıcı ile üretilen ürünlerin sergilendiği, müşterilerin talep oluşturabildiği ve admin panelinden tüm sürecin yönetilebildiği full-stack web uygulaması.

🌐 **Canlı:** [https://eses3-d.vercel.app](https://eses3-d.vercel.app)

---

## ✨ Özellikler

### Müşteri Tarafı
- **Ürün Vitrini** — Kategorilere göre filtreleme, çoklu kategori desteği
- **Ürün Kartı Galerisi** — Mobilde swipe, masaüstünde mouse tracking ile görsel geçişi
- **Slot Bazlı Renk Seçimi** — Ürün başına birden fazla renk slotu, müşteri kendi kombinasyonunu seçer
- **Talep Listesi** — Aynı üründen farklı renklerle birden fazla ekleme, onay dialogu, fiyat gösterimi
- **Toptan Satış** — 6 kademeli indirim (%20–%50), renk seçim modalı, tek/çift katlı stand hediyesi
- **Özel Tasarım Sayfası** — STL dosyası ve genel istek gönderimi
- **Açık/Koyu Tema**

### Admin Paneli (`/admin`)
- Dashboard, ürün/kategori/talep yönetimi
- Görsel yükleme (Cloudinary)
- Ürün: fiyat, slot bazlı renk tanımlama, çoklu kategori, toptan satışa izin ver toggle
- Talep yönetimi: WhatsApp entegrasyonu, TOPTAN badge, durum takibi
- E-posta bildirimi (Resend API — talep + toptan talep)

### Toptan Satış (`/toptan`)

| Kademe | Min. Adet | İndirim |
|--------|-----------|---------|
| 1      | 50        | %20     |
| 2      | 60        | %25     |
| 3      | 70        | %30     |
| 4      | 80        | %35     |
| 5      | 90        | %40     |
| 6      | 100       | %50     |

- 50–70 adet: Tek Katlı Anahtarlık Standı hediye
- 80–100+ adet: Çift Katlı Anahtarlık Standı hediye

---

## 🛠️ Teknoloji

| Katman     | Teknoloji                                      |
|------------|------------------------------------------------|
| Frontend   | React, Vite, Tailwind CSS                      |
| Backend    | Node.js, Express.js                            |
| Veritabanı | MongoDB Atlas, Mongoose                        |
| Görseller  | Cloudinary                                     |
| Auth       | JWT                                            |
| E-posta    | Resend API                                     |
| Hosting    | Vercel (frontend), Render (backend)            |
| SEO        | react-helmet-async, Schema.org, Open Graph     |
| Analytics  | Google Analytics (GA4), Google Search Console   |
| Uptime     | UptimeRobot                                    |

---

## 📁 Proje Yapısı

```
eses3D/
├── client/                  # React Frontend (Vite)
│   ├── src/
│   │   ├── components/      # Header, Footer, ProductCard, ColorCircle, Loading, SEO
│   │   ├── pages/           # HomePage, ProductsPage, ProductDetailPage,
│   │   │   │                  RequestListPage, RequestSuccessPage,
│   │   │   │                  CustomDesignPage, WholesalePage
│   │   │   └── admin/       # AdminLogin, AdminDashboard, AdminProducts,
│   │   │                      AdminCategories, AdminRequests
│   │   ├── context/         # RequestContext, WholesaleContext, ThemeContext
│   │   ├── services/        # api.js (Axios)
│   │   └── index.css        # Tailwind + custom styles
│   ├── public/              # logo.jpeg, favicon, robots.txt, sitemap.xml
│   └── vercel.json          # SPA routing
├── server/                  # Node.js Backend
│   ├── models/              # Product, Category, Request, Admin
│   ├── routes/              # API rotaları
│   ├── controllers/         # İş mantığı
│   ├── services/            # emailService.js (Resend)
│   ├── middleware/           # auth.js (JWT)
│   ├── config/              # cloudinary.js, db.js
│   └── server.js
└── memory-bank/             # Proje dokümantasyonu
```

---

## 🚀 Kurulum

```bash
# Backend
cd server && npm install && npm run dev

# Frontend (ayrı terminal)
cd client && npm install && npm run dev
```

### Ortam Değişkenleri

**Server (.env)**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
WHATSAPP_NUMBER=905522234619
CLIENT_URL=http://localhost:5173
RESEND_API_KEY=re_...
NOTIFICATION_EMAILS=eses3dprint@gmail.com
```

**Client (Vercel)**
```
VITE_API_URL=https://eses3d.onrender.com/api
```

---

## 📡 API Endpoints

| Yöntem   | Endpoint                        | Açıklama                    | Erişim  |
|----------|----------------------------------|-----------------------------|---------|
| GET      | `/api/products`                 | Ürünleri listele            | Public  |
| GET      | `/api/products?wholesale=true`  | Toptan ürünler              | Public  |
| GET      | `/api/products/:id`             | Ürün detayı                 | Public  |
| GET      | `/api/products/category/:slug`  | Kategoriye göre             | Public  |
| POST     | `/api/products`                 | Ürün ekle                   | Admin   |
| PUT      | `/api/products/:id`             | Ürün güncelle               | Admin   |
| DELETE   | `/api/products/:id`             | Ürün sil                    | Admin   |
| GET      | `/api/categories`               | Kategoriler                 | Public  |
| POST     | `/api/requests`                 | Talep oluştur               | Public  |
| GET      | `/api/requests`                 | Tüm talepler                | Admin   |
| PUT      | `/api/requests/:id/status`      | Durum güncelle              | Admin   |
| POST     | `/api/admin/login`              | Admin giriş                 | Public  |
| GET      | `/api/admin/stats`              | Dashboard istatistik        | Admin   |

---

## 🔄 Deployment

- **Git push** → Vercel ve Render otomatik deploy eder
- **UptimeRobot** → 5dk aralıkla backend ping, uyku engelleme
- **Google Analytics** → GA4 `G-TCYKZJRYNE`
- **Google Search Console** → Doğrulanmış, sitemap gönderildi
