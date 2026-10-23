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

## How index.html is organised

- **Catalogue arrays** near the top of the script: `ACTS`, `MOVES`, `QUEST` (`[file, title, what Clawd is doing, plaque line, ask-box words]`) and `SPRITES` (`[key, title, plaque line, room]`). `GROUPS` decides which pieces hang in which wall group, in order; `TOTAL` is derived from it. Ids are `act:X`, `move:X`, `quest:X`, `sprite:X`.
- **Stage**: `perform(path, …)` plays a Lottie file (or `quest:Key` → `performSprite`) and returns to `goIdle()`; after 25s idle Clawd naps. `understand(text)` maps ask-box words to pieces.
- **Wall**: `piece()` builds a frame + plaque; Lottie pieces load lazily via an IntersectionObserver and rest on their 55% frame. Pixel pieces are positioned with `placeSprite()` so they match the Lottie Clawd's size.
- **Seen markers**: every piece carries all four markers (`.mk-dot`, `.mk-stamp`, `.mk-paw`, `.mk-star`); `html[data-marker]` picks the visible one. Seen ids are stored in `localStorage["clawd-seen"]`.
- **Top bar**: `html[data-theme]` = red | white | navy | green, `html[data-texture]` = plain | clawd | stripes | dots | linen. Both are set in an inline `<head>` script before first paint. Texture images are data-URI SVGs in the CSS; dark walls use a white tone, the white gallery a black tone.
- **Playground**: `openRoom(name, { quiet })` stops the old room's scenes and starts the new one with claude.dev's code (`clawdScenes()`), except the Sky room, which uses the page's own `kiteActor()` so the kite can drift to clicks. Pass `quiet: true` when opening a room the visitor didn't ask for, so it isn't marked seen.
- **"Back to …"** button: `jumpFrom(piece, target)`; shown bottom-right when the piece is below, top-centre when it's above.

localStorage keys: `clawd-seen`, `clawd-wall`, `clawd-texture`, `clawd-marker`.

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
