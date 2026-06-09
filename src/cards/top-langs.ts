import { Card } from "./card";
import { LangData } from "../fetcher";
import { Theme } from "../themes";

const FONT = "'Segoe UI', Ubuntu, Sans-Serif";

export function renderTopLangsCard(
  data: LangData,
  theme: Theme,
  options: { langsCount: number },
): string {
  const langs = data.languages.slice(0, options.langsCount);
  const totalSize = langs.reduce((s, l) => s + l.size, 0);

  const innerW = 340;
  const barH = 8;
  const rowH = 34;
  const cardWidth = innerW + 48;
  const cardHeight = langs.length * rowH + 80;

  const rows = langs
    .map((lang, i) => {
      const pct = totalSize > 0 ? ((lang.size / totalSize) * 100).toFixed(1) : "0.0";
      const fillW = totalSize > 0 ? (lang.size / totalSize) * innerW : 0;
      const y = i * rowH;

      return `<circle cx="6" cy="${y + 10}" r="5" fill="${lang.color}"/>
<text x="18" y="${y + 14}" font-size="13" font-weight="600" font-family="${FONT}" fill="#${theme.text_color}">${lang.name}</text>
<text x="${innerW}" y="${y + 14}" font-size="13" font-weight="600" font-family="${FONT}" fill="#${theme.text_color}" text-anchor="end">${pct}%</text>
<rect x="0" y="${y + 22}" width="${innerW}" height="${barH}" rx="4" fill="#${theme.text_color}" opacity="0.06"/>
<rect x="0" y="${y + 22}" width="${fillW}" height="${barH}" rx="4" fill="${lang.color}" opacity="0.85"/>`;
    })
    .join("\n");

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

  return card.render(rows);
}
