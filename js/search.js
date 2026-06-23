/* ============================================================
   SehatKu — search.js
   Live search: Wikipedia API + DuckDuckGo Instant Answer
   ============================================================ */

const HEALTH_SUGGEST = [
  { label: 'Diabetes Melitus', type: 'Penyakit', icon: '🩸' },
  { label: 'Hipertensi', type: 'Penyakit', icon: '❤️' },
  { label: 'Asam Lambung (GERD)', type: 'Penyakit', icon: '🫁' },
  { label: 'Kolesterol Tinggi', type: 'Penyakit', icon: '🧬' },
  { label: 'Demam Berdarah Dengue', type: 'Penyakit', icon: '🦟' },
  { label: 'Tipes (Typhoid)', type: 'Penyakit', icon: '🌡️' },
  { label: 'Stroke', type: 'Penyakit', icon: '🧠' },
  { label: 'Kanker Payudara', type: 'Penyakit', icon: '🎗️' },
  { label: 'TBC (Tuberkulosis)', type: 'Penyakit', icon: '🫁' },
  { label: 'Asma', type: 'Penyakit', icon: '💨' },
  { label: 'Paracetamol', type: 'Obat', icon: '💊' },
  { label: 'Ibuprofen', type: 'Obat', icon: '💊' },
  { label: 'Amoxicillin', type: 'Obat', icon: '💊' },
  { label: 'Metformin', type: 'Obat', icon: '💊' },
  { label: 'Vitamin C', type: 'Suplemen', icon: '🍊' },
  { label: 'Vitamin D', type: 'Suplemen', icon: '☀️' },
  { label: 'Diet Sehat', type: 'Artikel', icon: '🥗' },
  { label: 'Olahraga Kardio', type: 'Artikel', icon: '🏃' },
  { label: 'Kesehatan Mental', type: 'Artikel', icon: '🧠' },
  { label: 'Pola Makan Diabetes', type: 'Artikel', icon: '🍽️' },
];

let searchTimeout = null;

function initSearch() {
  const input   = document.getElementById('heroSearchInput');
  const btn     = document.getElementById('heroSearchBtn');
  const suggest = document.getElementById('searchSuggestions');

  if (!input) return;

  input.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    const val = input.value.trim().toLowerCase();
    if (!val || val.length < 2) { hideSuggestions(); return; }
    searchTimeout = setTimeout(() => showSuggestions(val), 200);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') triggerSearch();
    if (e.key === 'Escape') hideSuggestions();
  });

  btn.addEventListener('click', triggerSearch);

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#mainSearch')) hideSuggestions();
  });

  // Tab switching
  document.querySelectorAll('.rtab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.rtab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const currentQuery = document.getElementById('searchQueryDisplay').textContent;
      if (currentQuery) performSearch(currentQuery, tab.dataset.tab);
    });
  });
}

function showSuggestions(query) {
  const suggest = document.getElementById('searchSuggestions');
  const filtered = HEALTH_SUGGEST.filter(s => s.label.toLowerCase().includes(query)).slice(0, 7);
  if (!filtered.length) { hideSuggestions(); return; }

  suggest.innerHTML = filtered.map(s => `
    <div class="suggestion-item" onclick="quickSearch('${s.label}')">
      <span class="suggestion-icon">${s.icon}</span>
      <span class="suggestion-label">${highlightMatch(s.label, query)}</span>
      <span class="suggestion-type">${s.type}</span>
    </div>
  `).join('');
  suggest.classList.add('visible');
}

function highlightMatch(text, query) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return text.slice(0, idx) +
    `<strong style="color:var(--clr-primary)">${text.slice(idx, idx + query.length)}</strong>` +
    text.slice(idx + query.length);
}

function hideSuggestions() {
  const suggest = document.getElementById('searchSuggestions');
  if (suggest) suggest.classList.remove('visible');
}

function triggerSearch() {
  const input = document.getElementById('heroSearchInput');
  const query = input ? input.value.trim() : '';
  if (!query) return;
  hideSuggestions();
  quickSearch(query);
}

function quickSearch(query) {
  const input = document.getElementById('heroSearchInput');
  if (input) input.value = query;
  hideSuggestions();
  performSearch(query, 'all');
}

async function performSearch(query, tab = 'all') {
  const section = document.getElementById('searchResultsSection');
  const grid    = document.getElementById('resultsGrid');
  const loading = document.getElementById('resultsLoading');
  const display = document.getElementById('searchQueryDisplay');

  if (!section || !grid) return;

  display.textContent = query;
  section.style.display = 'block';
  grid.innerHTML = '';
  loading.classList.add('visible');

  // Scroll to results
  setTimeout(() => section.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);

  try {
    const results = [];

    // 1. Wikipedia API (bahasa Indonesia)
    if (tab === 'all' || tab === 'wiki') {
      const wikiResults = await fetchWikipedia(query);
      results.push(...wikiResults);
    }

    // 2. Wikipedia bahasa Inggris (medical terms)
    if (tab === 'all' || tab === 'wiki') {
      const wikiEnResults = await fetchWikipediaEn(query);
      results.push(...wikiEnResults);
    }

    // 3. News via RSS proxy (health news)
    if (tab === 'all' || tab === 'news') {
      const newsResults = await fetchHealthNews(query);
      results.push(...newsResults);
    }

    loading.classList.remove('visible');

    if (!results.length) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="empty-icon">🔍</div>
          <h3>Tidak ada hasil untuk "${query}"</h3>
          <p>Coba kata kunci lain atau periksa ejaan Anda.</p>
        </div>`;
      return;
    }

    grid.innerHTML = results.map(r => `
      <div class="result-card" onclick="window.open('${r.url}','_blank')">
        <div class="result-source">📖 ${r.source}</div>
        <div class="result-title">${r.title}</div>
        <div class="result-snippet">${r.snippet}</div>
        <a class="result-link" href="${r.url}" target="_blank" rel="noopener">
          Baca selengkapnya →
        </a>
      </div>
    `).join('');

  } catch (err) {
    loading.classList.remove('visible');
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-icon">⚠️</div>
        <h3>Terjadi kesalahan</h3>
        <p>Gagal memuat hasil. Periksa koneksi internet Anda.</p>
      </div>`;
    console.error('Search error:', err);
  }
}

/* ---- Wikipedia ID ---- */
async function fetchWikipedia(query) {
  const url = `https://id.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&srlimit=3&origin=*`;
  try {
    const res  = await fetch(url);
    const data = await res.json();
    return (data.query?.search || []).map(item => ({
      source:  'Wikipedia (Indonesia)',
      title:   item.title,
      snippet: stripHtml(item.snippet) + '...',
      url:     `https://id.wikipedia.org/wiki/${encodeURIComponent(item.title)}`,
    }));
  } catch { return []; }
}

/* ---- Wikipedia EN ---- */
async function fetchWikipediaEn(query) {
  const q = query + ' health medical';
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&utf8=&format=json&srlimit=3&origin=*`;
  try {
    const res  = await fetch(url);
    const data = await res.json();
    return (data.query?.search || []).slice(0,2).map(item => ({
      source:  'Wikipedia (English)',
      title:   item.title,
      snippet: stripHtml(item.snippet) + '...',
      url:     `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title)}`,
    }));
  } catch { return []; }
}

/* ---- Health News via RSS2JSON ---- */
async function fetchHealthNews(query) {
  // Uses rss2json public API to fetch health news
  const rssSources = [
    `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fhealth.detik.com%2Frss%2F&api_key=&count=20`,
    `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.alodokter.com%2Ffeed&count=20`,
  ];
  const results = [];
  for (const src of rssSources) {
    try {
      const res  = await fetch(src);
      const data = await res.json();
      if (data.status === 'ok' && data.items) {
        const q = query.toLowerCase();
        const matched = data.items.filter(item =>
          (item.title && item.title.toLowerCase().includes(q)) ||
          (item.description && item.description.toLowerCase().includes(q))
        ).slice(0, 2);
        matched.forEach(item => results.push({
          source:  data.feed?.title || 'Berita Kesehatan',
          title:   item.title,
          snippet: stripHtml(item.description || item.content || '').slice(0, 200) + '...',
          url:     item.link || item.guid || '#',
        }));
      }
    } catch { /* skip */ }
  }
  // fallback: DuckDuckGo abstract
  if (!results.length) {
    try {
      const ddg = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query+' kesehatan')}&format=json&no_redirect=1&skip_disambig=1&origin=*`);
      const d = await ddg.json();
      if (d.Abstract) {
        results.push({
          source:  d.AbstractSource || 'DuckDuckGo',
          title:   d.Heading || query,
          snippet: d.Abstract.slice(0, 250) + '...',
          url:     d.AbstractURL || `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
        });
      }
    } catch { /* skip */ }
  }
  return results;
}

function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

function closeSearchResults() {
  const section = document.getElementById('searchResultsSection');
  if (section) section.style.display = 'none';
  const input = document.getElementById('heroSearchInput');
  if (input) input.value = '';
}

// Init
document.addEventListener('DOMContentLoaded', initSearch);
