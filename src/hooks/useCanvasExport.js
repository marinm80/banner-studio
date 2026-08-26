// Renders the banner to a canvas and hands back a data URL, plus the busy and
// error flags the download dialog shows. The drawing itself lives in
// utils/canvasUtils; this only wraps it in React state and starts the browser
// download.

import { useCallback, useState } from 'react';
import { renderBanner } from '../utils/canvasUtils';

export default function useCanvasExport() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const toDataUrl = useCallback(async ({ canvas: size, background, layers, quality, format }) => {
    setBusy(true);
    setError(null);
    try {
      const canvas = await renderBanner({ canvas: size, background, layers });
      return format === 'png'
        ? canvas.toDataURL('image/png')
        : canvas.toDataURL('image/jpeg', quality);
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setBusy(false);
    }
  }, []);

  const download = useCallback((dataUrl, filename, format) => {
    // Strip any extension the user typed so switching format cannot produce
    // something like "banner.png.jpg".
    const ext = format === 'png' ? 'png' : 'jpg';
    const clean = filename.replace(/\.(png|jpe?g)$/i, '') || 'banner';
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${clean}.${ext}`;
    a.click();
  }, []);

  return { toDataUrl, download, busy, error };
}
