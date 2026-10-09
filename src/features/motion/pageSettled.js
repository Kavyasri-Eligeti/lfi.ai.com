// Whether a page change (the curtain) is running. Heavy work such as building
// a WebGL scene waits until it has finished, so the curtain never stutters.
let changing = false;
const waiting = new Set();

export function setPageChanging(value) {
  changing = value;
  if (changing) return;
  const run = [...waiting];
  waiting.clear();
  run.forEach((fn) => fn());
}

/** Runs `fn` once no page change is running; returns a cancel function. */
export function whenPageSettled(fn) {
  if (!changing) {
    fn();
    return () => {};
  }
  waiting.add(fn);
  return () => waiting.delete(fn);
}
