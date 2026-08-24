# blastoise-site

The landing page for [blastoise](https://github.com/TejasMehra/blastoise), a
Postgres migration safety tool.

Next.js (App Router) · TypeScript · Tailwind v4 · deployable to Vercel with no
configuration.

## Running it

```console
$ npm install
$ npm run dev      # http://localhost:3000
$ npm run build && npm start
```

## The page is a story

The main page is a scroll-driven narrative in three acts, told through sticky
"scenes" — tall scroll tracks whose progress drives every animation:

1. **act one — the line ships.** Scrolling types out one `ALTER TABLE`,
   character by character. It passed review; staging ran it in 82ms.
2. **act two — production.** The row counter scrubs from 1,000 to 5,000,000,
   `ACCESS EXCLUSIVE` stamps down, and the scroll drags the reader through all
   fifty-six seconds of the outage: the clock climbs, status lines light up,
   queries pile into a grid, the screen runs red, then cuts to black.
3. **act three — the catch.** The same line comes back and a pokeball drops on
   it. Each of the three wobbles surfaces a real fact read from the live
   database; the click is the verdict: `BLOCK`, exit 2, merge never happened.

Then the five verdicts deal out in a horizontal sweep, and the calm sections
follow: an interactive lab over the sixteen measured statement × size
combinations, real CLI output, the corpus finding, and install steps.

A small pokeball rolls in the corner as the page scrolls, ringed by the
reader's progress through the story.

### How the scenes work

`src/lib/scroll.ts` — a scene registers a frame callback; while its track is
near the viewport, one rAF loop per scene converts scroll position into a
progress value and the callback writes transforms, opacity, and text directly
to the DOM. No React re-renders on the scroll path, no layout-triggering
properties, so the scrub stays glued to the finger.

- `prefers-reduced-motion` gets the final frame of every scene, unstacked into
  plain flow by CSS.
- No-JS gets the same via a `<noscript>` stylesheet; all copy is in the HTML.
- Headless Chrome reports reduced-motion by default — `scripts/drive.mjs`
  overrides it, or screenshots silently capture the static fallback.

## Where the content comes from

Nothing on this page is invented. Two directories hold real material copied out
of the tool's own repository, read at build time:

| path | what it is |
|---|---|
| `content/docs/*.md` | the repository's `docs/` markdown, rendered at `/docs` |
| `content/output/*` | verbatim `blastoise check` and `blastoise ci` output, captured from real runs |

`content/output/` was produced by running the real CLI against a real
PostgreSQL 17.10 instance with a seeded 5,000,000-row `events` table and the
three-statement minimum-privilege role from the docs. `check-live.txt` exits 2.

The story's numbers are measurements from the repo's committed artifacts:
the same volatile-default `ALTER TABLE` took **82ms at 1,000 rows** and
**~56s at 5,000,000** (`artifacts/scale/results_current_34case.json`, README).
The lab's sixteen cells come from the same harness and are labelled
`measured` or `modelled` accordingly in `src/lib/battle.ts`.

## Type and tone

Everything lowercase, starting with the name. Inter for prose, JetBrains Mono
for the wordmark, SQL, and terminal output. No logo image, no display font —
the loudness lives in the motion, not the chrome.

## Local tooling

`scripts/drive.mjs` is a small Chrome DevTools Protocol driver used to scrub
the scenes and screenshot them while tuning:

```console
$ node --experimental-websocket scripts/drive.mjs '[{"goto":"http://localhost:3000/"},{"eval":"scrollTo(0,4600)"},{"wait":500},{"shot":"hold.png"}]'
```

Steps are `goto`, `scroll`, `click`, `key`, `eval`, `wait`, `shot`. It emulates
a real viewport, disables the reduced-motion default, and prints page errors
and console warnings so nothing hides behind a screenshot that looks fine.
