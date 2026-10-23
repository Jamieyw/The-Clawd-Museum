# CLAUDE.md

Guidance for working on The Clawd Museum.

## What this is

A single-page static site: an interactive museum of Clawd animations. No framework, no build step, no package manager. Everything the page does lives in `index.html` (inline CSS and JS); `assets/` holds the artwork and claude.dev's own scene code.

Run it with `python3 -m http.server 8766` and open http://127.0.0.1:8766/. It must be served over HTTP; `file://` breaks the `fetch` calls. Deployed on Render as a static site via `render.yaml` (publish dir `.`, no build) at https://the-clawd-museum.onrender.com; every push to `main` redeploys.

## Layout

```
index.html                 the whole page
assets/acts/*.json         33 Lottie acts from claude.dev (/shared/video/acts/)
assets/video/*.json        logo animations: looking, walking, waving
assets/sprites.json        8 pixel sprites from claude.dev's code (astronaut, pool, kite, walk, skate, scooter, bike, car)
assets/quest-sprites.json  8 sprites that exist only in Clawd's Quest (claude.dev/game)
assets/lottie_canvas.min.js  Lottie player (claude.dev's vendored copy)
assets/site/loader.js      tiny stand-in for the Turbopack runtime so claude.dev's modules can run here
assets/site/dots.js        claude.dev chunk: module 82742 (clawdActor, poolWater, dotSky, rideScene, …), patched
assets/site/space.js       claude.dev chunk: modules 98092 (spaceField) and 39149 (clawdNavMark), paths patched
assets/favicon.svg, clawd-mark.png
```

## Where the Clawds come from

All artwork was collected from **https://claude.dev/** and **https://claude.dev/game/** (Clawd's Quest). Both sites change over time, so new Clawd animations may appear; when asked to "check for new Clawds", look in these places and compare against what's already in `assets/`:

- **Lottie acts**: claude.dev's JS chunks (the `<script src="/_next/static/chunks/…">` files, plus chunks they reference) list `Clawd-*.json` names served from `https://claude.dev/shared/video/acts/`. Logo animations live at `/shared/video/clawd-*.json`.
- **Pixel sprites in the site code**: a chunk exporting `CLAWD`, `CLAWD_KITE`, `CLAWD_POOL`, `RIDE_SPRITES` holds them as `{w, h, fps, palette, base, deltas}` objects; extract the literals into `assets/sprites.json`.
- **Clawd's Quest**: `https://claude.dev/game/game.js` has a `Ja={Name:{cat,w,h,fps,palette,base,deltas,a0,standMatch},…}` object with the game's sprites; new ones go in `assets/quest-sprites.json`.

Sprite frames decode as: `base` is one character per pixel (`.` = transparent, otherwise a base-36 palette index), and each entry in `deltas` is a comma list of `<pixel index in base 36><new value>` changes from the previous frame.

Before adding anything, check it isn't a copy: several sources draw the same animation (most Clawd's Quest sprites are pixel-identical to the site's acts, and claude.dev's `Clawd-Dancing.json` and `Clawd-DancingHappy.json` are the same dance). Render both frame by frame and compare pixels; only keep pieces that actually differ. Then add the new piece to the right catalogue array, give it a plaque line and ask-box words, and place its id in a `GROUPS` entry.

## How index.html is organised

- **Catalogue arrays** near the top of the script: `ACTS`, `MOVES`, `QUEST` (`[file, title, what Clawd is doing, plaque line, ask-box words]`) and `SPRITES` (`[key, title, plaque line, room]`). `GROUPS` decides which pieces hang in which wall group, in order; `TOTAL` is derived from it. Ids are `act:X`, `move:X`, `quest:X`, `sprite:X`.
- **Stage**: `perform(path, …)` plays a Lottie file (or `quest:Key` → `performSprite`) and returns to `goIdle()`; after 25s idle Clawd naps. `understand(text)` maps ask-box words to pieces.
- **Wall**: `piece()` builds a frame + plaque; Lottie pieces load lazily via an IntersectionObserver and rest on their 55% frame. Pixel pieces are positioned with `placeSprite()` so they match the Lottie Clawd's size.
- **Seen markers**: every piece carries all four markers (`.mk-dot`, `.mk-stamp`, `.mk-paw`, `.mk-star`); `html[data-marker]` picks the visible one. Seen ids are stored in `sessionStorage["clawd-seen"]`, so they last for one tab: a reload keeps them, a new tab starts with everything unseen.
- **Top bar**: `html[data-theme]` = red | white | navy | green, `html[data-texture]` = plain | clawd | stripes | dots | linen. Both are set in an inline `<head>` script before first paint. Texture images are data-URI SVGs in the CSS; dark walls use a white tone, the white gallery a black tone.
- **Playground**: `openRoom(name, { quiet })` stops the old room's scenes and starts the new one with claude.dev's code (`clawdScenes()`), except the Sky room, which uses the page's own `kiteActor()` so the kite can drift to clicks. Pass `quiet: true` when opening a room the visitor didn't ask for, so it isn't marked seen.
- **"Back to …"** button: `jumpFrom(piece, target)`; shown bottom-right when the piece is below, top-centre when it's above.

Remembered across tabs in localStorage: `clawd-wall`, `clawd-texture`, `clawd-marker`. Per tab in sessionStorage: `clawd-seen`.

## Editing the claude.dev code in assets/site/

These files are minified third-party code. Keep edits minimal, make them with exact string replacements, and record each one in the comment at the top of `loader.js`. Current patches:
- `dots.js` `rideScene`: `startX`, `screenSpeed`, `stopAfterLap` options, an `again()` method, and a pixel-tight halo instead of the wide oval around the rider. Minified variable names get reused inside blocks (`e` is shadowed), so copy options into new outer variables first.
- `space.js`: claude.dev `/shared/...` paths pointed at `assets/`.

After changing anything in `assets/site/`, bump the `?v=N` on its `<script>` tags in `index.html` so browsers don't keep the old copy.

## Conventions

- Refer to Clawd by name; the page doesn't use he/him (or any pronoun) for Clawd.
- Copy is short and dry-funny; instructions stay plain even when there's a joke after them.
- Top-bar labels follow claude.dev's keyboard nav: `[1] SALON RED` style, monospace, uppercase.
- Gilt frame + cream plaque is the house style for controls (marker selector, room tabs, rides).
- Check new UI on all four walls (the white gallery needs dark text) and at phone width (no sideways scroll; hidden elements still count for overflow).
- Test in a real browser: click through pieces, rooms and rides and watch the console. There's no test suite.
