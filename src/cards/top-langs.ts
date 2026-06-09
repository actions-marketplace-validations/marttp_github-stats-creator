import { Card } from "./card";
import { LangData } from "../fetcher";
import { Theme } from "../themes";

export function renderTopLangsCard(
  data: LangData,
  theme: Theme,
  options: {
    langsCount: number;
  },
): string {
  const langs = data.languages.slice(0, options.langsCount);
  const totalSize = langs.reduce((s, l) => s + l.size, 0);

  const cardWidth = 400;
  const barHeight = 8;
  const lineHeight = 36;
  const cardHeight = 45 + langs.length * lineHeight + 25;

  const css = `
    .lang-name {
      font: 600 13px 'Segoe UI', Ubuntu, Sans-Serif;
      fill: #${theme.text_color};
    }
    .lang-percent {
      font: 600 13px 'Segoe UI', Ubuntu, Sans-Serif;
      fill: #${theme.text_color};
    }
    .lang-row {
      opacity: 0;
      animation: slideUp 0.4s ease-in-out forwards;
    }
    .bar-bg {
      rx: 4;
    }
    .bar-fill {
      rx: 4;
    }
  `;

  const card = new Card({
    width: cardWidth,
    height: cardHeight,
    colors: {
      titleColor: theme.title_color,
      textColor: theme.text_color,
      iconColor: theme.icon_color,
      bgColor: theme.bg_color,
      borderColor: theme.border_color,
    },
    title: "Most Used Languages",
  });
  card.setCSS(css);

  const barWidth = cardWidth - 50;
  const langRows = langs
    .map((lang, i) => {
      const percent =
        totalSize > 0 ? ((lang.size / totalSize) * 100).toFixed(1) : "0.0";
      const y = i * lineHeight;
      const fillWidth =
        totalSize > 0 ? (lang.size / totalSize) * barWidth : 0;
      const delay = (i + 1) * 150;

      return `<g class="lang-row" style="animation-delay: ${delay}ms">
          <circle cx="35" cy="${y + 12}" r="5" fill="${lang.color}" />
          <text class="lang-name" x="48" y="${y + 16}">${lang.name}</text>
          <text class="lang-percent" x="${cardWidth - 75}" y="${y + 16}">${percent}%</text>
          <rect class="bar-bg" x="25" y="${y + 24}" width="${barWidth}" height="${barHeight}" fill="#${theme.border_color}" />
          <rect class="bar-fill" x="25" y="${y + 24}" width="${fillWidth}" height="${barHeight}" fill="${lang.color}">
            <animate attributeName="width" from="0" to="${fillWidth}" dur="0.6s" begin="${delay}ms" fill="freeze" />
          </rect>
        </g>`;
    })
    .join("\n");

  return card.render(`
    <g>
      ${langRows}
    </g>
  `);
}
