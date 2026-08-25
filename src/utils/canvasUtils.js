import { waitForLayerFonts } from './fonts';
import { iconDataUri } from '../data/icons';

export const LINE_HEIGHT = 1.2;

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // Required so the canvas stays untainted and the export can be downloaded.
    // Hosts that don't send CORS headers fail here rather than silently
    // breaking the download later, which is why the message says what to do.
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(
        new Error(
          /^https?:/i.test(src)
            ? 'That image could not be loaded. The site hosting it may not allow other sites to use it — download the picture and use “Upload your own background” instead.'
            : 'One of the images in this banner could not be loaded.'
        )
      );
    img.src = src;
  });
}

// Scales and crops the image to fill the whole canvas (same as object-fit: cover).
export function drawCover(ctx, img, w, h) {
  const scale = Math.max(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
}

export function textBlockMetrics(ctx, layer) {
  ctx.font = `${layer.weight} ${layer.size}px "${layer.font}"`;
  const lines = String(layer.text ?? '').split('\n');
  const widths = lines.map((l) => ctx.measureText(l).width);
  const width = Math.max(1, ...widths);
  const lineH = layer.size * LINE_HEIGHT;
  return { lines, widths, width, height: lines.length * lineH, lineH };
}

// Geometry of a terminal layer, shared by the DOM preview and the canvas export
// so what you drag around is exactly what gets rendered.
export function terminalMetrics(layer) {
  const lines = String(layer.lines ?? '').split('\n');
  const titleBarH = layer.titleBar ? 44 : 0;
  const height = titleBarH + layer.padding * 2 + lines.length * layer.lineGap;
  return { lines, titleBarH, height, width: layer.width };
}

export function iconSrc(layer) {
  return layer.src || iconDataUri(layer.svg, layer.tint);
}

function roundRect(ctx, x, y, w, h, r) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

function withTransform(ctx, layer, w, h, draw) {
  ctx.save();
  ctx.globalAlpha = layer.opacity;
  // Rotation in the DOM happens around the element's center; mirror that here.
  ctx.translate(layer.x + w / 2, layer.y + h / 2);
  ctx.rotate((layer.rotation * Math.PI) / 180);
  ctx.translate(-w / 2, -h / 2);
  draw();
  ctx.restore();
}

function drawTextLayer(ctx, layer) {
  const m = textBlockMetrics(ctx, layer);
  withTransform(ctx, layer, m.width, m.height, () => {
    if (layer.box?.enabled) {
      ctx.save();
      ctx.globalAlpha = layer.opacity * layer.box.opacity;
      ctx.fillStyle = layer.box.color;
      roundRect(
        ctx,
        -layer.box.padX,
        -layer.box.padY,
        m.width + layer.box.padX * 2,
        m.height + layer.box.padY * 2,
        layer.box.radius
      );
      ctx.fill();
      ctx.restore();
    }

    ctx.font = `${layer.weight} ${layer.size}px "${layer.font}"`;
    ctx.fillStyle = layer.color;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    if (layer.shadow?.enabled) {
      ctx.shadowColor = layer.shadow.color;
      ctx.shadowBlur = layer.shadow.blur;
      ctx.shadowOffsetX = layer.shadow.dx;
      ctx.shadowOffsetY = layer.shadow.dy;
    }
    m.lines.forEach((line, i) => {
      let offset = 0;
      if (layer.align === 'center') offset = (m.width - m.widths[i]) / 2;
      if (layer.align === 'right') offset = m.width - m.widths[i];
      // (lineH - size) / 2 approximates the half-leading of the DOM line-height.
      ctx.fillText(line, offset, i * m.lineH + (m.lineH - layer.size) / 2);
    });
  });
}

function drawImageLayer(ctx, layer, img) {
  const w = layer.width;
  const h = w * (img.height / img.width);
  withTransform(ctx, layer, w, h, () => {
    if (layer.radius) {
      roundRect(ctx, 0, 0, w, h, layer.radius);
      ctx.clip();
    }
    ctx.drawImage(img, 0, 0, w, h);
  });
}

function drawIconLayer(ctx, layer, img) {
  const s = layer.size;
  withTransform(ctx, layer, s, s, () => {
    if (layer.badge !== 'none') {
      ctx.save();
      ctx.globalAlpha = layer.opacity * layer.badgeOpacity;
      ctx.fillStyle = layer.badgeColor;
      if (layer.badge === 'circle') {
        ctx.beginPath();
        ctx.arc(s / 2, s / 2, s * 0.78, 0, Math.PI * 2);
        ctx.fill();
      } else {
        roundRect(ctx, -s * 0.22, -s * 0.22, s * 1.44, s * 1.44, s * 0.3);
        ctx.fill();
      }
      ctx.restore();
    }
    // Non-square custom icons are fitted inside the square box instead of
    // being stretched (matches object-fit: contain in the preview).
    const ratio = img.width / img.height || 1;
    const dw = ratio >= 1 ? s : s * ratio;
    const dh = ratio >= 1 ? s / ratio : s;
    ctx.drawImage(img, (s - dw) / 2, (s - dh) / 2, dw, dh);
  });
}

function drawTerminalLayer(ctx, layer) {
  const m = terminalMetrics(layer);
  withTransform(ctx, layer, m.width, m.height, () => {
    ctx.save();
    ctx.globalAlpha = layer.opacity * layer.bgOpacity;
    ctx.fillStyle = layer.bgColor;
    roundRect(ctx, 0, 0, m.width, m.height, layer.radius);
    ctx.fill();
    ctx.restore();

    roundRect(ctx, 0, 0, m.width, m.height, layer.radius);
    ctx.strokeStyle = layer.borderColor;
    ctx.globalAlpha = layer.opacity * 0.5;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.globalAlpha = layer.opacity;

    if (layer.titleBar) {
      ['#f87171', '#fbbf24', '#34d399'].forEach((c, i) => {
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(layer.padding + 8 + i * 24, 22, 7, 0, Math.PI * 2);
        ctx.fill();
      });
      if (layer.title) {
        ctx.fillStyle = layer.borderColor;
        ctx.globalAlpha = layer.opacity * 0.7;
        ctx.font = `${Math.round(layer.fontSize * 0.85)}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(layer.title, m.width / 2, 22);
        ctx.globalAlpha = layer.opacity;
      }
    }

    ctx.font = `${layer.fontSize}px monospace`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    m.lines.forEach((line, i) => {
      const isPrompt = line.trimStart().startsWith('$');
      ctx.fillStyle = isPrompt ? layer.promptColor : layer.textColor;
      ctx.globalAlpha = layer.opacity * (isPrompt ? 0.95 : 0.7);
      ctx.fillText(
        line,
        layer.padding,
        m.titleBarH + layer.padding + i * layer.lineGap + layer.lineGap / 2
      );
    });
  });
}

// Composes the full banner (background + layers) at exact pixel size.
export async function renderBanner({ canvas: size, background, layers }) {
  const canvas = document.createElement('canvas');
  canvas.width = size.width;
  canvas.height = size.height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = background?.source === 'color' ? background.color : size.fill;
  ctx.fillRect(0, 0, size.width, size.height);

  if (background?.url) {
    const img = await loadImage(background.url);
    drawCover(ctx, img, size.width, size.height);
    if (background.overlay > 0) {
      ctx.save();
      ctx.globalAlpha = background.overlay;
      ctx.fillStyle = background.overlayColor || '#000000';
      ctx.fillRect(0, 0, size.width, size.height);
      ctx.restore();
    }
  }

  await waitForLayerFonts(layers);

  const images = {};
  for (const l of layers) {
    if (l.type === 'image') images[l.id] = await loadImage(l.src);
    else if (l.type === 'icon') images[l.id] = await loadImage(iconSrc(l));
  }

  for (const l of layers) {
    if (l.type === 'text') drawTextLayer(ctx, l);
    else if (l.type === 'image') drawImageLayer(ctx, l, images[l.id]);
    else if (l.type === 'icon') drawIconLayer(ctx, l, images[l.id]);
    else if (l.type === 'terminal') drawTerminalLayer(ctx, l);
  }

  return canvas;
}
