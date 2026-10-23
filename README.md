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

## Credits

This is an unofficial fan project and isn't affiliated with or endorsed by Anthropic.
Clawd, every animation, sprite and icon in `assets/`, and the scene code in `assets/site/` belong to Anthropic and were collected from [claude.dev](https://claude.dev) and [Clawd's Quest](https://claude.dev/game/). The museum page itself (`index.html`, `assets/site/loader.js`) was written for this project.
