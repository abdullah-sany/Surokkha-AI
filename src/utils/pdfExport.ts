import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/** Convert an OKLCH color to an sRGB CSS rgb()/rgba() value. */
function oklchToRgb(oklch: string): string {
  const match = oklch
    .trim()
    .match(/^oklch\(\s*([\d.]+%?|none)\s+([\d.]+%?|none)\s+([\d.]+|none)(?:\s*\/\s*([\d.]+%?|none))?\s*\)$/i);

  if (!match) return 'rgb(0, 0, 0)';

  const parse = (value: string, percentScale = 1) => {
    if (value.toLowerCase() === 'none') return 0;
    return value.endsWith('%') ? (parseFloat(value) / 100) * percentScale : parseFloat(value);
  };

  // CSS Color 4: L is 0..1, C is normally 0..0.4, h is degrees.
  const L = parse(match[1]);
  const C = parse(match[2]);
  const h = match[3].toLowerCase() === 'none' ? 0 : parseFloat(match[3]);
  const alpha = match[4] && match[4].toLowerCase() !== 'none'
    ? (match[4].endsWith('%') ? parseFloat(match[4]) / 100 : parseFloat(match[4]))
    : 1;

  const hr = (h * Math.PI) / 180;
  const a = C * Math.cos(hr);
  const b = C * Math.sin(hr);

  // OKLab -> LMS (Ottosson / CSS Color 4 conversion).
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  const rLinear = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const gLinear = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bLinear = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  const toSrgb = (value: number) => {
    const v = Math.max(0, Math.min(1, value));
    return Math.round(255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055));
  };

  const r = toSrgb(rLinear);
  const g = toSrgb(gLinear);
  const blue = toSrgb(bLinear);

  return alpha < 1
    ? `rgba(${r}, ${g}, ${blue}, ${Math.max(0, Math.min(1, alpha))})`
    : `rgb(${r}, ${g}, ${blue})`;
}

/** Replace all supported OKLCH functions, including ones with alpha. */
function replaceOklch(value: string): string {
  let result = '';
  let i = 0;

  while (i < value.length) {
    const start = value.toLowerCase().indexOf('oklch(', i);
    if (start === -1) {
      result += value.slice(i);
      break;
    }

    result += value.slice(i, start);

    let depth = 0;
    let end = -1;
    for (let j = start + 6; j < value.length; j++) {
      if (value[j] === '(') depth++;
      else if (value[j] === ')') {
        depth--;
        if (depth === 0) {
          end = j + 1;
          break;
        }
      }
    }

    if (end === -1) {
      result += value.slice(start);
      break;
    }

    result += oklchToRgb(value.slice(start, end));
    i = end;
  }

  return result;
}

/**
 * html2canvas currently cannot parse CSS color functions such as oklch().
 * Temporarily replace them in page styles while the PDF is rendered.
 */
function sanitizeDocumentColors(): () => void {
  const styleElements = Array.from(document.querySelectorAll('style'));
  const styleBackups = styleElements.map((style) => ({
    style,
    text: style.textContent ?? '',
  }));

  styleBackups.forEach(({ style, text }) => {
    if (text.includes('oklch(')) {
      style.textContent = replaceOklch(text);
    }
  });

  const inlineElements = Array.from(document.querySelectorAll<HTMLElement>('[style*="oklch"], [style*="OKLCH"]'));
  const inlineBackups = inlineElements.map((element) => ({
    element,
    style: element.getAttribute('style') ?? '',
  }));

  inlineBackups.forEach(({ element, style }) => {
    element.setAttribute('style', replaceOklch(style));
  });

  return () => {
    styleBackups.forEach(({ style, text }) => {
      style.textContent = text;
    });
    inlineBackups.forEach(({ element, style }) => {
      element.setAttribute('style', style);
    });
  };
}

export async function generateAnalysisPDF(element: HTMLElement, filename: string): Promise<void> {
  if (!element) {
    throw new Error('PDF report element was not found.');
  }

  // html2canvas fails on modern Tailwind/CSS output containing oklch().
  // Keep the workaround scoped to the short capture period and restore the UI afterward.
  const restoreColors = sanitizeDocumentColors();

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 800,
      onclone: (clonedDocument) => {
        // Sanitize any style blocks that were copied into html2canvas's cloned document.
        clonedDocument.querySelectorAll('style').forEach((style) => {
          const text = style.textContent ?? '';
          if (text.includes('oklch(')) {
            style.textContent = replaceOklch(text);
          }
        });

        clonedDocument.querySelectorAll<HTMLElement>('[style*="oklch"], [style*="OKLCH"]').forEach((el) => {
          const style = el.getAttribute('style');
          if (style?.toLowerCase().includes('oklch(')) {
            el.setAttribute('style', replaceOklch(style));
          }
        });
      },
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } finally {
    restoreColors();
  }
}
