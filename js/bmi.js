/* ============================================================
   SehatKu — bmi.js
   BMI Calculator with visual indicator
   ============================================================ */

function calculateBMI() {
  const weight = parseFloat(document.getElementById('bmiWeight')?.value);
  const height = parseFloat(document.getElementById('bmiHeight')?.value);
  const age    = parseFloat(document.getElementById('bmiAge')?.value);
  const result = document.getElementById('bmiResult');
  const score  = document.getElementById('bmiScore');
  const cat    = document.getElementById('bmiCategory');
  const advice = document.getElementById('bmiAdvice');
  const indic  = document.getElementById('bmiIndicator');

  if (!weight || !height || weight <= 0 || height <= 0) {
    showToast('⚠️ Masukkan berat dan tinggi badan yang valid.');
    return;
  }
  if (weight > 500 || height > 300) {
    showToast('⚠️ Nilai yang dimasukkan tidak realistis.');
    return;
  }

  const heightM = height / 100;
  const bmi     = weight / (heightM * heightM);
  const bmiFixed = bmi.toFixed(1);

  let category, color, adviceText, pct;

  if (bmi < 17) {
    category = '⚠️ Kekurangan Berat Badan Berat';
    color    = '#4aa3df';
    adviceText = 'Anda sangat kekurangan berat badan. Segera konsultasikan dengan dokter dan ahli gizi untuk mendapatkan program peningkatan berat badan yang sehat.';
    pct = Math.max(2, ((bmi - 10) / (18.5 - 10)) * 25);
  } else if (bmi < 18.5) {
    category = '🔵 Kekurangan Berat Badan';
    color    = '#4aa3df';
    adviceText = 'Berat badan Anda di bawah normal. Tingkatkan asupan kalori dengan makanan bergizi dan konsultasikan dengan ahli gizi.';
    pct = 10 + ((bmi - 17) / (18.5 - 17)) * 15;
  } else if (bmi < 23) {
    category = '✅ Berat Badan Normal';
    color    = '#1a7a4a';
    adviceText = 'Selamat! Berat badan Anda ideal. Pertahankan dengan pola makan seimbang dan olahraga rutin 150 menit/minggu.';
    pct = 25 + ((bmi - 18.5) / (23 - 18.5)) * 33;
  } else if (bmi < 25) {
    category = '🟡 Berat Badan Berlebih (Pre-obesitas)';
    color    = '#f0a500';
    adviceText = 'Berat badan Anda sedikit berlebih. Kurangi asupan kalori 200-300 kal/hari dan tingkatkan aktivitas fisik.';
    pct = 58 + ((bmi - 23) / (25 - 23)) * 8;
  } else if (bmi < 30) {
    category = '🟠 Obesitas Tingkat I';
    color    = '#e07020';
    adviceText = 'Anda mengalami obesitas tingkat I. Risiko penyakit kardiovaskular meningkat. Konsultasikan dengan dokter untuk program penurunan berat badan.';
    pct = 66 + ((bmi - 25) / (30 - 25)) * 16;
  } else {
    category = '🔴 Obesitas Tingkat II–III';
    color    = '#e04040';
    adviceText = 'Obesitas berat dapat meningkatkan risiko diabetes, hipertensi, dan penyakit jantung. Segera konsultasikan dengan dokter spesialis.';
    pct = Math.min(97, 82 + ((bmi - 30) / 10) * 15);
  }

  // Update UI
  score.textContent = bmiFixed;
  score.style.color = color;
  cat.textContent   = category;
  cat.style.color   = color;
  advice.textContent = adviceText;
  indic.style.left  = pct + '%';
  result.style.display = 'block';

  // Scroll to result
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Extra note for age
  if (age && age > 60) {
    showToast('ℹ️ Untuk lansia, interpretasi BMI mungkin berbeda. Konsultasikan dengan dokter.');
  }
}

// Allow Enter key in BMI fields
document.addEventListener('DOMContentLoaded', () => {
  ['bmiWeight','bmiHeight','bmiAge'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter') calculateBMI(); });
  });
});
