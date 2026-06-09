export interface CardColors {
  titleColor: string;
  textColor: string;
  iconColor: string;
  bgColor: string;
  borderColor: string;
}

const BASE_ANIMATIONS = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes scaleIn {
    from { transform: translate(-5px, 5px) scale(0); }
    to { transform: translate(-5px, 5px) scale(1); }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes rankAnim {
    from { stroke-dashoffset: 251.2; }
    to { stroke-dashoffset: var(--progress-offset); }
  }
`;

export class Card {
  width: number;
  height: number;
  borderRadius: number;
  colors: CardColors;
  title: string;
  hideBorder: boolean;
  hideTitle: boolean;
  extraCSS: string;
  paddingX: number;
  paddingY: number;
  animations: boolean;

  constructor(opts: {
    width?: number;
    height?: number;
    borderRadius?: number;
    colors: CardColors;
    title?: string;
  }) {
    this.width = opts.width || 450;
    this.height = opts.height || 200;
    this.borderRadius = opts.borderRadius || 4.5;
    this.colors = opts.colors;
    this.title = opts.title || "";
    this.hideBorder = false;
    this.hideTitle = false;
    this.extraCSS = "";
    this.paddingX = 25;
    this.paddingY = 35;
    this.animations = true;
  }

  setHideBorder(v: boolean) {
    this.hideBorder = v;
  }

  setHideTitle(v: boolean) {
    this.hideTitle = v;
    if (v) this.height -= 30;
  }

  setCSS(css: string) {
    this.extraCSS = css;
  }

  disableAnimations() {
    this.animations = false;
  }

  render(body: string): string {
    const header = this.hideTitle
      ? ""
      : `<text
            class="header"
            x="${this.paddingX}"
            y="${this.paddingY}"
            data-testid="header"
          >${this.title}</text>`;

    const noAnim = this.animations
      ? ""
      : "* { animation-duration: 0s !important; animation-delay: 0s !important; }";

    return `<svg
      width="${this.width}"
      height="${this.height}"
      viewBox="0 0 ${this.width} ${this.height}"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
    >
      <style>
        .header {
          font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif;
          fill: #${this.colors.titleColor};
          animation: fadeIn 0.8s ease-in-out forwards;
        }
        ${this.extraCSS}
        ${BASE_ANIMATIONS}
        ${noAnim}
      </style>

      <rect
        x="0.5"
        y="0.5"
        rx="${this.borderRadius}"
        height="99%"
        width="${this.width - 1}"
        stroke="#${this.colors.borderColor}"
        fill="#${this.colors.bgColor}"
        stroke-opacity="${this.hideBorder ? 0 : 1}"
      />

      ${header}

      <g
        transform="translate(0, ${this.hideTitle ? this.paddingX : this.paddingY + 20})"
      >
        ${body}
      </g>
    </svg>`;
  }
}
