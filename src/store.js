// The Redux store and the autosave wiring.
//
// Three slices: `editor` (the banner itself, plus its undo history),
// `backgrounds` (the background catalog) and `icons` (icons the user added).
//
// Saved work is restored at import time — before React mounts — so App can ask
// `hadSavedWork` whether this is a first visit, and written back on a 500ms
// debounce after every dispatch.

import { configureStore } from '@reduxjs/toolkit';
import editorReducer, { hydrate } from './features/editor/editorSlice';
import backgroundsReducer from './features/backgrounds/backgroundsSlice';
import iconsReducer, { hydrateIcons } from './features/icons/iconsSlice';
import { loadSaved, saveState, debounce } from './utils/persistence';

export const store = configureStore({
  reducer: {
    editor: editorReducer,
    backgrounds: backgroundsReducer,
    icons: iconsReducer,
  },
  // Layers carry data URIs and plain objects only, but they can get large; the
  // deep serializability scan is pure overhead here.
  middleware: (getDefault) => getDefault({ serializableCheck: false, immutableCheck: false }),
});

const saved = loadSaved();
export const hadSavedWork = !!saved?.layers?.length;

if (saved) {
  store.dispatch(hydrate(saved));
  if (saved.icons) store.dispatch(hydrateIcons(saved.icons));
}

store.subscribe(debounce(() => saveState(store.getState()), 500));
