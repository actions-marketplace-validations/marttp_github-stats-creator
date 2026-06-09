export interface CardColors {
  titleColor: string;
  textColor: string;
  iconColor: string;
  bgColor: string;
  borderColor: string;
}

const FONT = "'Segoe UI', Ubuntu, Sans-Serif";

export class Card {
  width: number;
  height: number;
  borderRadius: number;
  colors: CardColors;
  title: string;
  subtitle: string;
  hideBorder: boolean;
  hideTitle: boolean;
  padding: number;

  constructor(opts: {
    width?: number;
    height?: number;
    borderRadius?: number;
    colors: CardColors;
    title?: string;
    subtitle?: string;
  }) {
    this.width = opts.width || 450;
    this.height = opts.height || 200;
    this.borderRadius = opts.borderRadius || 4.5;
    this.colors = opts.colors;
    this.title = opts.title || "";
    this.subtitle = opts.subtitle || "";
    this.hideBorder = false;
    this.hideTitle = false;
    this.padding = 24;
  }

  setHideBorder(v: boolean) {
    this.hideBorder = v;
  }

  setHideTitle(v: boolean) {
    this.hideTitle = v;
  }

  render(body: string): string {
    const p = this.padding;
    let header = "";

    if (!this.hideTitle && this.title) {
      header = `<text x="${p}" y="${p + 16}" font-size="16" font-weight="600" font-family="${FONT}" fill="#${this.colors.titleColor}">${this.title}</text>`;
      if (this.subtitle) {
        header += `\n<text x="${p}" y="${p + 32}" font-size="11" font-family="${FONT}" fill="#${this.colors.textColor}" opacity="0.5">${this.subtitle}</text>`;
      }
    }

    const bodyY = this.hideTitle ? p : p + (this.subtitle ? 46 : 30);

    const sep = this.hideTitle
      ? ""
      : `<line x1="${p}" y1="${bodyY - 8}" x2="${this.width - p}" y2="${bodyY - 8}" stroke="#${this.colors.borderColor}" stroke-width="0.5" opacity="0.4"/>`;

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}" role="img">
  <rect x="0.5" y="0.5" width="${this.width - 1}" height="99%" rx="${this.borderRadius}" fill="#${this.colors.bgColor}" stroke="#${this.colors.borderColor}" stroke-opacity="${this.hideBorder ? 0 : 1}"/>
  ${header}
  ${sep}
  <g transform="translate(${p}, ${bodyY})">
    ${body}
  </g>
</svg>`;
  }
}
