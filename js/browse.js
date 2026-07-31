// Logic for all-breeds.html: the full browsable grid

const grid = document.getElementById('grid');
const tagline = document.getElementById('tagline');

async function init() {
  grid.innerHTML = `
    <div class="status" style="grid-column: 1 / -1;">
      <span class="paws">🐾 🐾 🐾</span>
      <div>Rounding up some cats…</div>
    </div>
  `;
  try {
    const breeds = await fetchBreeds();
    tagline.textContent = `${breeds.length} breeds, A to Z. Tap any card to flip it.`;
    grid.innerHTML = breeds.map((b, i) => cardTemplate(b, i, 'grid')).join('');
    grid.querySelectorAll('.card').forEach(attachFlip);
  } catch (err) {
    grid.innerHTML = `
      <div class="status" style="grid-column: 1 / -1;">
        <span class="paws">🙀</span>
        <div>Couldn't fetch the cats right now.</div>
        <button id="retryBtn" type="button">Try again</button>
      </div>
    `;
    document.getElementById('retryBtn').addEventListener('click', init);
    tagline.textContent = "The cat photo service didn't answer — try again in a moment.";
  }
}

init();
