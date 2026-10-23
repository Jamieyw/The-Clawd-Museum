# The Clawd Museum

A small, interactive museum for Clawd.
51 works by one small crab. The artist is in residence, takes requests, and accepts payment in pats.

**Visit it: <https://the-clawd-museum.onrender.com>**

## What's inside

- **The stage.** Clawd performs on request. Type things like "make coffee", "go fishing" or "facepalm", click Clawd for a heart (or many clicks for confetti), and leave Clawd alone long enough for a nap.
- **The collection.** 51 pieces in gilt frames with museum plaques, grouped by what Clawd is doing: Hello there, Mood swings, At work, Dance and play, Slowing down, Outdoors, and Getting around. Hover to peek, click to see it performed on stage, then use the "Back to …" button to return to your spot.
- **Seen markers.** Pieces you've seen get a COLLECTED stamp by default; switch to a red dot, a cat paw print or a gold star from the "Mark seen with" selector.
- **The playground.** Four rooms drawn in claude.dev's dotted style: Space (an astronaut follows your cursor; click for shooting stars), Pool (click for ripples), Sky (click and the kite drifts there) and Road (five rides, one lap each; click the road to go again).
- **Walls.** Four wall colours (Salon red, White gallery, Midnight navy, Green) in the top bar, each with a menu of textures: Plain, Clawd wallpaper, Regency stripes, Pixel dots and Linen. Keys 1–4 switch colour.

Your wall, texture and marker are remembered in your browser. The pieces you've seen are remembered only in the current tab, so a new tab starts with everything unseen.

## Where Clawd comes from

Every Clawd in the museum was collected from two places:

- **[claude.dev](https://claude.dev/)**: the 33 animated acts, the logo's waving, looking and walking, the pixel-art astronaut, pool float, kite and rides, and the dotted scenes used in the playground.
- **[Clawd's Quest](https://claude.dev/game/)**: the arcade game on claude.dev, source of the 8 moves that appear nowhere else (crab walking, disappointed, dizzy, facepalm, hula, glancing around, pointing and running).

Both sites get updated from time to time. When they add new Clawd animations, those can be collected and hung in the museum too.

## Animations and sprites

The museum has two kinds of Clawd animation. They look the same on the page, but they're stored differently:

| | **Sprites** (`assets/sprites/`) | **Lottie animations** (`assets/animations/`) |
|---|---|---|
| What's stored | A grid of coloured squares for every frame: "this pixel is orange, this one is black…" | Instructions for drawing shapes: "a rectangle here, moving this way" |
| Like | A flipbook of tiny pixel drawings | A recipe the browser follows to draw each frame |
| Examples | The astronaut, pool float, kite, rides, and the 8 Clawd's Quest moves | Fishing, coffee, rainbow and the other acts, plus the logo's waving |
| Where they came from | Hidden inside claude.dev's code and the game's code | Separate animation files on claude.dev |

"Sprite" is a video-game word for a small character picture that moves around the screen; animated sprites work like a flipbook, showing slightly different frames one after another.

## What's in `assets/`

```
assets/
  animations/
    acts/            33 Lottie animations (the main collection)
    logo/            the logo's waving, looking and walking
  sprites/
    claude-dev.json  pixel sprites from claude.dev: astronaut, pool float, kite, rides
    clawds-quest.json  the 8 moves only found in Clawd's Quest
  code/
    lottie_canvas.min.js  the Lottie animation player
    claude-dev/      claude.dev's playground and logo code, plus a small loader
  images/            the browser-tab icon and the plain Clawd logo
```

## Run it locally

It's a static site with no build step, but it has to be served over HTTP (the animations are loaded with `fetch`, which browsers block on `file://`):

```sh
python3 -m http.server 8766
```

Then open <http://127.0.0.1:8766/>.

## Deploy on Render

The repo includes a `render.yaml` blueprint for a Render **Static Site**:

1. In the Render dashboard, choose **New → Blueprint** and pick this repository.
2. Render reads `render.yaml`; there's no build command, and the site is published from the repo root.
3. Every push to the default branch redeploys.

(Or create a **Static Site** by hand with an empty build command and `.` as the publish directory.)
