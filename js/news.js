/* ============================================================
   SehatKu — news.js
   Load health news from RSS feeds via rss2json
   ============================================================ */

const NEWS_FEEDS = [
  { url: 'https://health.detik.com/rss/', name: 'Detik Health' },
  { url: 'https://www.alodokter.com/feed', name: 'Alodokter' },
  { url: 'https://hellosehat.com/feed/', name: 'Hello Sehat' },
];

const FALLBACK_NEWS = [
  {
    source: 'SehatKu Editorial',
    title: '10 Kebiasaan Sehat yang Bisa Dimulai Hari Ini',
    desc: 'Mulai dari tidur cukup, makan sayuran, hingga olahraga ringan — perubahan kecil berdampak besar pada kesehatan jangka panjang Anda.',
    date: 'Hari ini',
    url: 'pages/artikel.html',
  },
  {
    source: 'SehatKu Editorial',
    title: 'Pentingnya Cek Kesehatan Rutin Setiap Tahun',
    desc: 'Medical check-up tahunan membantu mendeteksi penyakit lebih awal. Penyakit seperti hipertensi dan diabetes sering tidak bergejala.',
    date: 'Kemarin',
    url: 'pages/artikel.html',
  },
  {
    source: 'SehatKu Editorial',
    title: 'Panduan Lengkap: Cara Menjaga Kesehatan Mental di Era Digital',
    desc: 'Terlalu banyak screen time berdampak pada kesehatan mental. Temukan strategi efektif membatasi penggunaan gadget.',
    date: '2 hari lalu',
    url: 'pages/artikel.html',
  },
  {
    source: 'SehatKu Editorial',
    title: 'Makanan Terbaik untuk Menurunkan Kolesterol Secara Alami',
    desc: 'Kolesterol tinggi adalah faktor risiko utama penyakit jantung. Beberapa makanan seperti oat, kacang-kacangan, dan ikan dapat membantu.',
    date: '3 hari lalu',
    url: 'pages/artikel.html',
  },
  {
    source: 'SehatKu Editorial',
    title: 'Gejala Diabetes yang Sering Diabaikan',
    desc: 'Rasa haus berlebihan, sering buang air kecil, dan penglihatan kabur bisa jadi tanda awal diabetes yang perlu diwaspadai.',
    date: '4 hari lalu',
    url: 'pages/penyakit.html',
  },
  {
    source: 'SehatKu Editorial',
    title: 'Cara Efektif Mengatasi Insomnia Tanpa Obat',
    desc: 'Sleep hygiene yang baik, hindari kafein setelah jam 2 siang, dan rutin berolahraga terbukti membantu kualitas tidur.',
    date: '5 hari lalu',
    url: 'pages/artikel.html',
  },
];

async function loadHealthNews() {
  const grid    = document.getElementById('newsGrid');
  const loading = document.getElementById('newsLoading');
  if (!grid) return;

  grid.innerHTML = '';
  if (loading) loading.style.display = 'block';

  let items = [];
  let loaded = false;

  // Try live RSS feeds
  for (const feed of NEWS_FEEDS) {
    if (loaded) break;
    try {
      const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}&count=6`;
      const res  = await fetch(url, { signal: AbortSignal.timeout(5000) });
      const data = await res.json();
      if (data.status === 'ok' && data.items?.length) {
        items = data.items.slice(0, 6).map(item => ({
          source: feed.name,
          title:  item.title,
          desc:   stripHtml(item.description || item.content || '').slice(0, 180) + '...',
          date:   formatDate(item.pubDate),
          url:    item.link || '#',
        }));
        loaded = true;
      }
    } catch { /* try next feed */ }
  }

  if (!items.length) items = FALLBACK_NEWS;

  if (loading) loading.style.display = 'none';

  grid.innerHTML = items.map(item => `
    <div class="news-card">
      <div class="news-source">📰 ${item.source}</div>
      <div class="news-title">${item.title}</div>
      <div class="news-desc">${item.desc}</div>
      <div class="news-date">🕐 ${item.date}</div>
      <a class="news-link" href="${item.url}" target="_blank" rel="noopener">
        Baca selengkapnya →
      </a>
    </div>
  `).join('');
}

function formatDate(dateStr) {
  if (!dateStr) return 'Terkini';
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000 / 60);
    if (diff < 60)  return `${diff} menit lalu`;
    if (diff < 1440) return `${Math.floor(diff/60)} jam lalu`;
    if (diff < 43200) return `${Math.floor(diff/1440)} hari lalu`;
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return dateStr; }
}

function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

document.addEventListener('DOMContentLoaded', loadHealthNews);
