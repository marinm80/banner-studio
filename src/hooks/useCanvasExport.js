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
    const ext = format === 'png' ? 'png' : 'jpg';
    const clean = filename.replace(/\.(png|jpe?g)$/i, '') || 'banner';
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${clean}.${ext}`;
    a.click();
  }, []);

  return { toDataUrl, download, busy, error };
}
