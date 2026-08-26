// Icons the user added themselves. Two flavours are supported:
//   - svg:  pasted markup, scalable and tintable like the built-in set
//   - src:  an uploaded PNG/JPG/SVG file stored as a data URI

import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = { custom: [] };

const iconsSlice = createSlice({
  name: 'icons',
  initialState,
  reducers: {
    addCustom: {
      prepare: ({ name, svg, src }) => ({
        payload: {
          id: `custom_${nanoid(6)}`,
          name: name?.trim() || 'My icon',
          category: 'My icons',
          keywords: 'custom uploaded mine',
          svg: svg || null,
          src: src || null,
          custom: true,
        },
      }),
      reducer(state, action) {
        state.custom.unshift(action.payload);
      },
    },
    removeCustom(state, action) {
      state.custom = state.custom.filter((i) => i.id !== action.payload);
    },
    hydrateIcons(state, action) {
      if (Array.isArray(action.payload)) state.custom = action.payload;
    },
  },
});

export const { addCustom, removeCustom, hydrateIcons } = iconsSlice.actions;
export default iconsSlice.reducer;
