// Autosave so nobody loses their banner by closing the tab. Everything stays in
// the browser — no account, no server, nothing uploaded anywhere.

const KEY = 'banner-studio:v1';

export function loadSaved() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveState(state) {
  try {
    const { canvas, background, layers, exportSettings } = state.editor;
    localStorage.setItem(
      KEY,
      JSON.stringify({ canvas, background, layers, exportSettings, icons: state.icons.custom })
    );
    return true;
  } catch {
    // Most likely a quota error from a large uploaded image. Losing autosave is
    // acceptable; losing the working session is not, so we just skip this save.
    return false;
  }
}

export function clearSaved() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* nothing to clean up */
  }
}

export function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}
