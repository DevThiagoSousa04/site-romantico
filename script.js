/* ============================================
   ROMANTIC SITE — script.js
   ============================================ */

/* ── CONFIG — edite aqui ── */
const CONFIG = {
  coupleStart: new Date('2023-06-15T20:00:00'), // ← data do início do relacionamento
  loveLetterText: `Existem palavras que mal conseguem traduzir o que sinto por você. Mas vou tentar mesmo assim, porque você merece ouvir isso todos os dias.

Você mudou a forma como eu vejo o mundo. Com você, o sol parece mais brilhante, o silêncio tem som, e cada dia ganha um novo significado. Não preciso de grandes aventuras — só preciso de você ao meu lado para que qualquer momento se torne inesquecível.

Obrigado por cada sorriso, por cada abraço, por cada momento que compartilhamos. Você é meu lar, minha paz, minha melhor parte.

Eu Te amo hoje, amanhã e sempre.`,
  tracks: [
    { name: "Confident", artist: "Justin Bieber" },
    { name: "Rude",  artist: "MAGIC!" },
    { name: "Princesa", artist: "Léo Foguete" },
  ],
  galleryEmojis: ["📷","💑","🌹","🌅","🥂","🎶"],
  galleryCaptions: [
    "foto favorita",
    "Nós dois juntos",
    "Momento especial",
    "Aquele dia inesquecível",
    "Comemorando juntos",
    "Nossa música tocando"
  ],
  galleryImages: [
    "img/buque.jpg",
    "img/foto1.jpg",
    "img/foto3.jpg",
    "img/ft2.jpg",
    "img/natal.webp",
    "img/virada.jpg"
  ]
};

/* ─── LOADER ─── */
window.addEventListener('load', () => {
  renderTrackList();
  selectTrack(0);
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    initReveal();
    initLetter();
  }, 1800);
});

/* ─── CURSOR ─── */
const cursor = document.getElementById('cursor');
const trail  = document.getElementById('cursor-trail');
let mx = 0, my = 0, tx = 0, ty = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});
(function animTrail() {
  tx += (mx - tx) * 0.12;
  ty += (my - ty) * 0.12;
  trail.style.left = tx + 'px';
  trail.style.top  = ty + 'px';
  requestAnimationFrame(animTrail);
})();
document.querySelectorAll('a, button, .gallery-item, .track-item, .reason-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '6px'; cursor.style.height = '6px';
    trail.style.width = '48px'; trail.style.height = '48px';
    trail.style.borderColor = 'rgba(201,116,138,.7)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '12px'; cursor.style.height = '12px';
    trail.style.width = '32px'; trail.style.height = '32px';
    trail.style.borderColor = 'rgba(201,116,138,.4)';
  });
});

/* ─── NAV SCROLL ─── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* ─── PARTICLES ─── */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(true); }
  reset(initial) {
    this.x = Math.random() * W;
    this.y = initial ? Math.random() * H : H + 20;
    this.size = Math.random() * 3 + 1;
    this.speedY = -(Math.random() * .4 + .15);
    this.speedX = (Math.random() - .5) * .3;
    this.opacity = Math.random() * .25 + .05;
    this.type = Math.random() > .7 ? 'heart' : 'dot';
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = Math.random() * .015 + .005;
    this.life = 0; this.maxLife = 600 + Math.random() * 400;
  }
  drawHeart(cx, cy, s) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(s * .016, s * .016);
    ctx.beginPath();
    ctx.moveTo(0, -25);
    ctx.bezierCurveTo(-35, -55, -70, -15, -70, 10);
    ctx.bezierCurveTo(-70, 40, -35, 60, 0, 80);
    ctx.bezierCurveTo(35, 60, 70, 40, 70, 10);
    ctx.bezierCurveTo(70, -15, 35, -55, 0, -25);
    ctx.closePath();
    ctx.restore();
  }
  update() {
    this.wobble += this.wobbleSpeed;
    this.x += this.speedX + Math.sin(this.wobble) * .2;
    this.y += this.speedY;
    this.life++;
    if (this.y < -20 || this.life > this.maxLife) this.reset(false);
  }
  draw() {
    const alpha = this.life < 60 ? this.opacity * (this.life / 60)
      : this.life > this.maxLife - 60 ? this.opacity * ((this.maxLife - this.life) / 60)
      : this.opacity;
    ctx.globalAlpha = alpha;
    if (this.type === 'heart') {
      ctx.fillStyle = '#c9748a';
      this.drawHeart(this.x, this.y, this.size * 2.5);
      ctx.fill();
    } else {
      ctx.fillStyle = '#e8d5a0';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * .6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}

for (let i = 0; i < 55; i++) particles.push(new Particle());

(function animParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animParticles);
})();


/* ─── REVEAL ON SCROLL ─── */
function initReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const io  = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        io.unobserve(e.target);
      }
    });
  }, { threshold: .12 });
  els.forEach(el => io.observe(el));
}

/* ─── LOVE LETTER TYPEWRITER ─── */
function initLetter() {
  const el   = document.getElementById('letter-text');
  const curs = document.getElementById('letter-cursor');
  const text = CONFIG.loveLetterText;
  let i = 0, started = false;

  const io = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      io.disconnect();
      (function type() {
        if (i < text.length) {
          const ch = text[i++];
          if (ch === '\n') el.innerHTML += '<br/>';
          else el.innerHTML += ch;
          setTimeout(type, ch === '.' || ch === ',' ? 60 : 22);
        } else { curs.style.animation = 'blink 1s step-end infinite'; }
      })();
    }
  }, { threshold: .3 });
  io.observe(document.getElementById('letter'));
}

/* ─── GALLERY LIGHTBOX ─── */
function openLightbox(idx) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lb-image');
  img.src = CONFIG.galleryImages[idx] || '';
  img.alt = CONFIG.galleryCaptions[idx] || '';
  document.getElementById('lb-caption').textContent = CONFIG.galleryCaptions[idx] || '';
  lb.classList.add('active');
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
}

/* ─── PLAYLIST ─── */
let currentTrack = 0, playing = false;
const tracks = CONFIG.tracks;

function renderTrackList() {
  const list = document.getElementById('track-list');
  list.innerHTML = tracks.map((track, i) => `
    <div class="track-item${i === 0 ? ' active' : ''}" onclick="selectTrack(${i})">
      <span class="track-num">${String(i + 1).padStart(2, '0')}</span>
      <div class="track-info">
        <strong>${track.name}</strong>
        <span>${track.artist}</span>
      </div>
      <span class="track-dur">${track.duration || ''}</span>
    </div>
  `).join('');
}

function selectTrack(idx) {
  currentTrack = idx;
  document.getElementById('track-name').textContent   = tracks[idx].name;
  document.getElementById('track-artist').textContent = tracks[idx].artist;
  document.querySelectorAll('.track-item').forEach((t, i) => {
    t.classList.toggle('active', i === idx);
  });
}
function togglePlay() {
  playing = !playing;
  document.getElementById('play-btn').textContent = playing ? '⏸' : '▶';
  document.getElementById('vinyl').classList.toggle('playing', playing);
}
function prevTrack() {
  selectTrack((currentTrack - 1 + tracks.length) % tracks.length);
}
function nextTrack() {
  selectTrack((currentTrack + 1) % tracks.length);
}

/* ─── SURPRISE ─── */
function triggerSurprise() {
  const modal = document.getElementById('surprise-modal');
  const rain  = document.getElementById('heart-rain');
  modal.classList.add('active');
  rain.innerHTML = '';
  const emojis = ['❤️','💕','💖','💗','💓','💝','🌸','✨'];
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const h = document.createElement('div');
      h.className = 'falling-heart';
      h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      h.style.left = Math.random() * 100 + 'vw';
      h.style.fontSize = (Math.random() * 1.5 + .8) + 'rem';
      const dur = Math.random() * 3 + 3;
      h.style.animation = `fall ${dur}s linear forwards`;
      rain.appendChild(h);
      setTimeout(() => h.remove(), dur * 1000);
    }, i * 120);
  }
}
function closeSurprise() {
  document.getElementById('surprise-modal').classList.remove('active');
}

/* ─── PARALLAX HERO ─── */
window.addEventListener('scroll', () => {
  const hero = document.getElementById('hero');
  const y    = window.scrollY;
  const content = hero.querySelector('.hero-content');
  if (content && y < window.innerHeight) {
    content.style.transform = `translateY(${y * .18}px)`;
    content.style.opacity   = 1 - y / 500;
  }
});

/* ─── SMOOTH SCROLL FOR NAV LINKS ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
