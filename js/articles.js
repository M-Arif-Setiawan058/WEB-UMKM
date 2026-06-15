/* ============================================================
   SehatKu — articles.js
   Load and render featured articles
   ============================================================ */

const ARTICLES = [
  {
    emoji: '❤️', tag: 'Jantung', date: '10 Jun 2025', readTime: '5 menit',
    title: '7 Cara Menjaga Kesehatan Jantung di Usia 30-an',
    excerpt: 'Penyakit jantung kini mengintai di usia yang lebih muda. Temukan strategi pencegahan yang terbukti secara ilmiah.',
    url: 'pages/artikel.html',
  },
  {
    emoji: '🩸', tag: 'Diabetes', date: '8 Jun 2025', readTime: '7 menit',
    title: 'Panduan Lengkap Pola Makan Penderita Diabetes Tipe 2',
    excerpt: 'Diet yang tepat adalah fondasi manajemen diabetes. Pelajari makanan yang boleh dan tidak boleh dikonsumsi.',
    url: 'pages/artikel.html',
  },
  {
    emoji: '🧠', tag: 'Mental Health', date: '6 Jun 2025', readTime: '4 menit',
    title: 'Mengenali Tanda-tanda Burnout dan Cara Mengatasinya',
    excerpt: 'Burnout bukan sekadar kelelahan biasa. Kenali gejalanya sejak dini dan ambil langkah pemulihan yang tepat.',
    url: 'pages/artikel.html',
  },
  {
    emoji: '🥗', tag: 'Gizi', date: '4 Jun 2025', readTime: '6 menit',
    title: 'Superfood Lokal Indonesia yang Menyehatkan',
    excerpt: 'Tempe, daun kelor, dan kunyit adalah beberapa superfood lokal dengan manfaat luar biasa bagi kesehatan.',
    url: 'pages/artikel.html',
  },
  {
    emoji: '🏃', tag: 'Olahraga', date: '2 Jun 2025', readTime: '5 menit',
    title: 'Olahraga 30 Menit Sehari: Manfaat yang Mengejutkan',
    excerpt: 'Hanya 30 menit olahraga sedang per hari sudah cukup untuk menurunkan risiko berbagai penyakit kronis.',
    url: 'pages/artikel.html',
  },
  {
    emoji: '😴', tag: 'Tidur', date: '30 Mei 2025', readTime: '4 menit',
    title: 'Mengapa Tidur 7-8 Jam Sangat Penting untuk Kesehatan',
    excerpt: 'Kurang tidur berkaitan dengan obesitas, diabetes, dan gangguan imun. Pelajari cara memperbaiki kualitas tidur Anda.',
    url: 'pages/artikel.html',
  },
];

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('articlesGrid');
  if (!grid) return;
  grid.innerHTML = ARTICLES.map(a => `
    <div class="article-card">
      <div class="article-img">${a.emoji}</div>
      <div class="article-body">
        <div class="article-tags">
          <span class="article-tag">${a.tag}</span>
        </div>
        <div class="article-title">${a.title}</div>
        <div class="article-excerpt">${a.excerpt}</div>
        <div class="article-meta">
          <span>${a.date} · ${a.readTime} baca</span>
          <button class="article-read-btn" onclick="window.location.href='${a.url}'">Baca →</button>
        </div>
      </div>
    </div>
  `).join('');
});