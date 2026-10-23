// Minimal stand-in for the Turbopack runtime, so claude.dev's own scene code
// (spaceField, poolWater, dotSky, rideScene, clawdActor, clawdNavMark) can run
// on this page. space.js has its claude.dev file paths pointed at assets/.
// dots.js's rideScene is patched to take startX, screenSpeed and
// stopAfterLap so the rider does one lap and stops where he started; again()
// sends him round once more. Cloud dots are only hidden where they'd touch his
// pixels, instead of the site's wide oval.
(() => {
  const defs = {}, cache = {};
  const req = id => {
    if (cache[id]) return cache[id].exports;
    if (!defs[id]) throw new Error(`claude.dev module ${id} isn't bundled here`);
    const m = (cache[id] = { exports: {} });
    defs[id]({
      i: req, r: req,
      A: id => Promise.resolve(req(id)),
      s(list) {
        for (let k = 0; k < list.length; k += 3) {
          const [name, kind, v] = [list[k], list[k + 1], list[k + 2]];
          if (kind === 1) Object.defineProperty(m.exports, name, { get: v, enumerable: true });
          else m.exports[name] = v;
        }
      },
    });
    return m.exports;
  };
  // The scenes only need the reduced-motion flag from the site's shared utils.
  cache[93384] = { exports: { reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches } };
  globalThis.TURBOPACK = {
    push(entry) {
      for (let k = 1; k < entry.length - 1; k++)
        if (typeof entry[k] === "number" && typeof entry[k + 1] === "function") defs[entry[k]] = entry[k + 1];
    },
  };
  globalThis.clawdScenes = () => ({ ...req(82742), ...req(98092), ...req(39149) });
})();
