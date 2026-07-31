# Cat Breed Explorer 🐾

A small, interactive cat breed game. Flip through 30 breeds one at a time, hit
"Surprise Me" for a random pick, or open the full A–Z grid in a new tab.
Built as a plain static site — no build step, no framework, no dependencies.

## Project structure

```
cat-breed-explorer/
├── index.html        # the game: one card at a time, with prev/next + random
├── all-breeds.html    # the full A–Z grid, opened from index.html in a new tab
├── css/
│   └── style.css      # shared styling for both pages
├── js/
│   ├── breeds.js       # shared: fetches TheCatAPI data, builds card HTML
│   ├── app.js          # index.html logic (navigation, random, swipe/keys)
│   └── browse.js        # all-breeds.html logic (renders the grid)
└── README.md
```

Breed data and photos come from the free [TheCatAPI](https://thecatapi.com/),
fetched live in the browser — nothing is hardcoded or stored.

## Running it locally

No build tools needed. Because the pages load JavaScript with plain
`<script src="...">` tags (not ES modules), you can open `index.html`
directly in a browser, or serve the folder locally:

```bash
npx serve .
# or
python3 -m http.server
```

## Deploying to GitHub + Vercel

1. Push this folder to a new GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "Cat Breed Explorer"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
2. On [vercel.com](https://vercel.com), click **Add New → Project**, import
   the repo, and deploy. No framework preset or build command is needed —
   Vercel will detect it as a static site automatically.

## Notes

- TheCatAPI works without a key for light use, but is rate-limited. If you
  hit limits (e.g. sharing the link with a lot of friends at once), grab a
  free key at thecatapi.com and paste it into the `API_KEY` constant at the
  top of `js/breeds.js`.
- The 30 breeds shown are sampled evenly across the full alphabetical breed
  list, so you get variety in origin and temperament rather than just the
  first 30 alphabetically.
- Both pages fail gracefully with a "try again" button if the API is
  unreachable, and card images fall back to a 🐱 placeholder if a photo
  can't be resolved.

## Ideas for next steps

- A "guess the breed" mode that hides the name until you flip the card
- Favoriting/collecting breeds (would need `localStorage` or a small backend)
- Filtering by temperament or origin
