// Logic for index.html: one-card-at-a-time browsing

const stage = document.getElementById('stage');
const tagline = document.getElementById('tagline');
const randomBtn = document.getElementById('randomBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progress = document.getElementById('progress');

let breeds = [];
let currentIndex = 0;

function renderStage() {
  const breed = breeds[currentIndex];
  stage.innerHTML = cardTemplate(breed, currentIndex, 'stage');
  attachFlip(stage.querySelector('.card'));
  progress.textContent = `${currentIndex + 1} / ${breeds.length}`;
}

function renderError() {
  stage.innerHTML = `
    <div class="status">
      <span class="paws">🙀</span>
      <div>Couldn't fetch the cats right now.</div>
      <button id="retryBtn" type="button">Try again</button>
    </div>
  `;
  document.getElementById('retryBtn').addEventListener('click', init);
  tagline.textContent = "The cat photo service didn't answer — try again in a moment.";
}

async function init() {
  randomBtn.disabled = true;
  prevBtn.disabled = true;
  nextBtn.disabled = true;
  stage.innerHTML = `
    <div class="status">
      <span class="paws">🐾 🐾 🐾</span>
      <div>Rounding up some cats…</div>
    </div>
  `;
  try {
    breeds = await fetchBreeds();
    currentIndex = 0;
    tagline.textContent = `${breeds.length} breeds, A to Z. Flip a card, or explore one at a time.`;
    randomBtn.disabled = false;
    prevBtn.disabled = false;
    nextBtn.disabled = false;
    renderStage();
  } catch (err) {
    renderError();
  }
}

prevBtn.addEventListener('click', () => {
  if (!breeds.length) return;
  currentIndex = (currentIndex - 1 + breeds.length) % breeds.length;
  renderStage();
});

nextBtn.addEventListener('click', () => {
  if (!breeds.length) return;
  currentIndex = (currentIndex + 1) % breeds.length;
  renderStage();
});

randomBtn.addEventListener('click', () => {
  if (!breeds.length) return;
  let idx = Math.floor(Math.random() * breeds.length);
  if (breeds.length > 1 && idx === currentIndex) idx = (idx + 1) % breeds.length;
  currentIndex = idx;
  renderStage();
  const card = stage.querySelector('.card');
  card.classList.add('pulse');
  setTimeout(() => card.classList.remove('pulse'), 1400);
  setTimeout(() => card.classList.add('flipped'), 350);
});

document.addEventListener('keydown', (e) => {
  if (!breeds.length) return;
  if (e.key === 'ArrowLeft') prevBtn.click();
  if (e.key === 'ArrowRight') nextBtn.click();
});

let touchStartX = null;
stage.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
stage.addEventListener('touchend', (e) => {
  if (touchStartX === null || !breeds.length) return;
  const dx = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(dx) > 45) { dx < 0 ? nextBtn.click() : prevBtn.click(); }
  touchStartX = null;
}, { passive: true });

init();
