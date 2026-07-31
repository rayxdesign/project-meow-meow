// Shared data + rendering helpers used by both index.html and all-breeds.html

const CAT_API = 'https://api.thecatapi.com/v1';
const TARGET_COUNT = 30;

// Optional: paste a free API key from https://thecatapi.com/ here to raise rate limits.
const API_KEY = '';

const GEO = {
  'United States': { continent: 'North America', flag: '🇺🇸' },
  'United Kingdom': { continent: 'Europe', flag: '🇬🇧' },
  'Egypt': { continent: 'Africa', flag: '🇪🇬' },
  'Thailand': { continent: 'Asia', flag: '🇹🇭' },
  'Iran': { continent: 'Asia', flag: '🇮🇷' },
  'Russia': { continent: 'Europe & Asia', flag: '🇷🇺' },
  'Turkey': { continent: 'Europe & Asia', flag: '🇹🇷' },
  'Ethiopia': { continent: 'Africa', flag: '🇪🇹' },
  'Singapore': { continent: 'Asia', flag: '🇸🇬' },
  'Japan': { continent: 'Asia', flag: '🇯🇵' },
  'Myanmar': { continent: 'Asia', flag: '🇲🇲' },
  'Isle of Man': { continent: 'Europe', flag: '🇮🇲' },
  'Kenya': { continent: 'Africa', flag: '🇰🇪' },
  'Canada': { continent: 'North America', flag: '🇨🇦' },
  'Norway': { continent: 'Europe', flag: '🇳🇴' },
  'Netherlands': { continent: 'Europe', flag: '🇳🇱' },
  'Germany': { continent: 'Europe', flag: '🇩🇪' },
  'Australia': { continent: 'Oceania', flag: '🇦🇺' },
  'China': { continent: 'Asia', flag: '🇨🇳' },
  'Korea': { continent: 'Asia', flag: '🇰🇷' },
  'Sri Lanka': { continent: 'Asia', flag: '🇱🇰' },
  'Malaysia': { continent: 'Asia', flag: '🇲🇾' },
  'Cyprus': { continent: 'Europe', flag: '🇨🇾' },
  'Greece': { continent: 'Europe', flag: '🇬🇷' },
  'Italy': { continent: 'Europe', flag: '🇮🇹' },
  'Spain': { continent: 'Europe', flag: '🇪🇸' },
  'Brazil': { continent: 'South America', flag: '🇧🇷' },
  'Mexico': { continent: 'North America', flag: '🇲🇽' },
  'South Africa': { continent: 'Africa', flag: '🇿🇦' },
  'France': { continent: 'Europe', flag: '🇫🇷' },
  'Afghanistan': { continent: 'Asia', flag: '🇦🇫' },
  'Somalia': { continent: 'Africa', flag: '🇸🇴' },
  'Tunisia': { continent: 'Africa', flag: '🇹🇳' },
  'United Arab Emirates': { continent: 'Asia', flag: '🇦🇪' },
  'India': { continent: 'Asia', flag: '🇮🇳' },
  'New Zealand': { continent: 'Oceania', flag: '🇳🇿' }
};

function apiFetch(path) {
  const options = API_KEY ? { headers: { 'x-api-key': API_KEY } } : undefined;
  return fetch(`${CAT_API}${path}`, options);
}

function pickSpread(list, count) {
  const sorted = [...list].sort((a, b) => a.name.localeCompare(b.name));
  if (sorted.length <= count) return sorted;
  const step = sorted.length / count;
  const picked = [];
  for (let i = 0; i < count; i++) picked.push(sorted[Math.floor(i * step)]);
  return picked;
}

function truncate(text, max) {
  if (!text) return '';
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(' ')) + '…';
}

function parseGeo(origin) {
  if (!origin) return null;
  if (GEO[origin]) return GEO[origin];
  const primary = origin.split(/[\/,]/)[0].replace(/\(.*?\)/g, '').trim();
  return GEO[primary] || null;
}

async function resolveImage(breed) {
  if (breed.image && breed.image.url) return breed.image.url;
  if (breed.reference_image_id) {
    try {
      const res = await apiFetch(`/images/${breed.reference_image_id}`);
      if (res.ok) {
        const data = await res.json();
        return data.url || null;
      }
    } catch (e) { /* fall through to null */ }
  }
  return null;
}

async function fetchBreeds() {
  const res = await apiFetch('/breeds');
  if (!res.ok) throw new Error('Request failed');
  const all = await res.json();
  const chosen = pickSpread(all, TARGET_COUNT);
  return Promise.all(chosen.map(async (b) => ({ ...b, imageUrl: await resolveImage(b) })));
}

function cardTemplate(breed, index, context) {
  const geo = parseGeo(breed.origin);
  const temperaments = (breed.temperament || '')
    .split(',').map(t => t.trim()).filter(Boolean).slice(0, 4);

  const photoInner = breed.imageUrl
    ? `<img src="${breed.imageUrl}" alt="${breed.name}" loading="lazy">`
    : `<div class="no-photo">🐱</div>`;

  const staggerAttr = context === 'grid' ? `style="--i:${index}"` : '';
  const extraClass = context === 'stage' ? ' no-stagger' : '';

  return `
    <div class="card${extraClass}" tabindex="0" role="button" aria-label="Flip card for ${breed.name}" ${staggerAttr}>
      <div class="card-inner">
        <div class="card-face card-front">
          <div class="photo-wrap">
            <div class="tape"></div>
            ${photoInner}
          </div>
          <div class="name-plate">
            ${breed.name}<br><span class="tap-hint">tap to meet me</span>
          </div>
        </div>
        <div class="card-face card-back">
          <h3>${breed.name}</h3>
          <div class="native-to">
            <span class="geo-flag">${geo ? geo.flag : '🌍'}</span>
            <div>
              <div class="native-label">Native to</div>
              <div class="native-value">${breed.origin || 'Unknown'}${geo ? ' · ' + geo.continent : ''}</div>
            </div>
          </div>
          <div class="fact">${truncate(breed.description, 120)}</div>
          <div class="meta-row">Lifespan: ${breed.life_span ? breed.life_span + ' yrs' : '—'}</div>
          <div class="chip-row">
            ${temperaments.map(t => `<span class="chip">${t}</span>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function attachFlip(card) {
  card.addEventListener('click', () => card.classList.toggle('flipped'));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.classList.toggle('flipped'); }
  });
}
