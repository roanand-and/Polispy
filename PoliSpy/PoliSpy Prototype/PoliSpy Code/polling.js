document.addEventListener('DOMContentLoaded', () => {
  const polls = ['mayor', 'governor', 'president'];
  const types = ['approve', 'indifferent', 'disapprove'];

  function key(poll, type) {
    return `poll_${poll}_${type}`;
  }

  function readCount(poll, type) {
    const value = localStorage.getItem(key(poll, type));
    return value ? parseInt(value, 10) : 0;
  }

  function writeCount(poll, type, val) {
    localStorage.setItem(key(poll, type), String(val));
  }

  function updateDisplay(poll) {
    const a = readCount(poll, 'approve');
    const ind = readCount(poll, 'indifferent');
    const d = readCount(poll, 'disapprove');
    const total = a + ind + d;

    const pct = (n) => {
      if (total === 0) return 0;
      return Math.round((n / total) * 100);
    };

    const aEl = document.getElementById(`${poll}-approve-count`);
    const indEl = document.getElementById(`${poll}-indifferent-count`);
    const dEl = document.getElementById(`${poll}-disapprove-count`);
    if (aEl) aEl.textContent = `${pct(a)}%`;
    if (indEl) indEl.textContent = `${pct(ind)}%`;
    if (dEl) dEl.textContent = `${pct(d)}%`;

    drawChart(poll);
  }

  function drawChart(poll) {
    const canvas = document.getElementById(`${poll}-chart`);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const a = readCount(poll, 'approve');
    const ind = readCount(poll, 'indifferent');
    const d = readCount(poll, 'disapprove');
    const total = a + ind + d;
    const w = canvas.width; const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2; const cy = h / 2; const radius = Math.min(cx, cy) - 6;
    if (total === 0) {
      ctx.fillStyle = '#efefef';
      ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.fill();
      return;
    }
    const segments = [
      { val: a, color: '#4caf50' },
      { val: ind, color: '#ffb300' },
      { val: d, color: '#e91e63' },
    ];
    let start = -Math.PI / 2;
    segments.forEach(s => {
      if (s.val <= 0) return;
      const angle = (s.val / total) * Math.PI * 2;
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.fillStyle = s.color;
      ctx.arc(cx, cy, radius, start, start + angle);
      ctx.closePath(); ctx.fill();
      start += angle;
    });
  }

  polls.forEach((poll) => {
    updateDisplay(poll);

    const approveBtn = document.getElementById(`${poll}-approve-btn`);
    const indifferentBtn = document.getElementById(`${poll}-indifferent-btn`);
    const disapproveBtn = document.getElementById(`${poll}-disapprove-btn`);

    if (approveBtn) approveBtn.addEventListener('click', () => {
      const cur = readCount(poll, 'approve');
      writeCount(poll, 'approve', cur + 1);
      updateDisplay(poll);
    });

    if (indifferentBtn) indifferentBtn.addEventListener('click', () => {
      const cur = readCount(poll, 'indifferent');
      writeCount(poll, 'indifferent', cur + 1);
      updateDisplay(poll);
    });

    if (disapproveBtn) disapproveBtn.addEventListener('click', () => {
      const cur = readCount(poll, 'disapprove');
      writeCount(poll, 'disapprove', cur + 1);
      updateDisplay(poll);
    });
  });
});
