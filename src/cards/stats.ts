import { Card } from "./card";
import { StatsData } from "../fetcher";
import { calculateRank } from "../rank";
import { icons } from "../icons";
import { Theme } from "../themes";

const FONT = "'Segoe UI', Ubuntu, Sans-Serif";

function kFormatter(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toString();
}

function encodeHTML(str: string): string {
  return str.replace(/[\u00A0-\u9999<>&](?!#)/gim, (i) => {
    return "&#" + i.charCodeAt(0) + ";";
  });
}

const STAT_ITEMS = [
  { key: "stars", icon: icons.star, label: "Stars" },
  { key: "commits", icon: icons.commits, label: "Commits" },
  { key: "prs", icon: icons.prs, label: "PRs" },
  { key: "issues", icon: icons.issues, label: "Issues" },
  { key: "contribs", icon: icons.contribs, label: "Contributed" },
] as const;

const ROW_H = 24;

export function renderStatsCard(
  stats: StatsData,
  theme: Theme,
  options: {
    showIcons: boolean;
    hideRank: boolean;
    includeAllCommits: boolean;
  },
): string {
  const rank = calculateRank({
    allCommits: options.includeAllCommits,
    commits: stats.totalCommits,
    prs: stats.totalPRs,
    issues: stats.totalIssues,
    reviews: stats.totalReviews,
    repos: stats.repos,
    stars: stats.totalStars,
    followers: stats.followers,
  });

  const values: Record<string, number> = {
    stars: stats.totalStars,
    commits: stats.totalCommits,
    prs: stats.totalPRs,
    issues: stats.totalIssues,
    contribs: stats.contributedTo,
  };

  const showRank = !options.hideRank;
  const iconX = 0;
  const labelX = options.showIcons ? 22 : 0;
  const valueX = 140;
  const metricsW = valueX + 60;

  const rankR = 36;
  const rankBoxW = showRank ? rankR * 2 + 24 : 0;
  const cardWidth = metricsW + rankBoxW + 24 + 48;

  const bodyH = STAT_ITEMS.length * ROW_H;
  const cardHeight = bodyH + 90;

  const rows = STAT_ITEMS.map((item, i) => {
    const y = i * ROW_H;
    const icon = options.showIcons
      ? `<svg x="${iconX}" y="${y}" width="14" height="14" viewBox="0 0 16 16" fill="#${theme.icon_color}" opacity="0.8">${icons[item.key === "stars" ? "star" : item.key === "commits" ? "commits" : item.key === "prs" ? "prs" : item.key === "issues" ? "issues" : "contribs"]}</svg>`
      : "";
    const dotsX = labelX + 60;
    const dotsW = valueX - dotsX - 6;
    return `${icon}<text x="${labelX}" y="${y + 12}" font-size="13" font-family="${FONT}" fill="#${theme.text_color}" opacity="0.7">${item.label}</text><text x="${dotsX}" y="${y + 12}" font-size="13" font-family="${FONT}" fill="#${theme.text_color}" opacity="0.2">${"·".repeat(Math.max(1, Math.floor(dotsW / 6)))}</text><text x="${valueX}" y="${y + 12}" font-size="13" font-weight="700" font-family="${FONT}" fill="#${theme.text_color}">${kFormatter(values[item.key])}</text>`;
  }).join("\n");

  const rankSvg = showRank
    ? (() => {
        const cx = metricsW + 24 + rankR + 12;
        const cy = bodyH / 2 + 2;
        const circ = 2 * Math.PI * rankR;
        const filled = ((100 - rank.percentile) / 100) * circ;
        return `<circle cx="${cx}" cy="${cy}" r="${rankR}" fill="none" stroke="#${theme.text_color}" stroke-width="5" opacity="0.08"/>
<circle cx="${cx}" cy="${cy}" r="${rankR}" fill="none" stroke="#${theme.ring_color}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${circ}" stroke-dashoffset="${circ - filled}" transform="rotate(-90 ${cx} ${cy})"/>
<text x="${cx}" y="${cy - 8}" text-anchor="middle" font-size="10" font-weight="600" font-family="${FONT}" fill="#${theme.text_color}" opacity="0.5" letter-spacing="1">RANK</text>
<text x="${cx}" y="${cy + 14}" text-anchor="middle" font-size="22" font-weight="800" font-family="${FONT}" fill="#${theme.text_color}">${rank.level}</text>`;
      })()
    : "";

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
    title: encodeHTML(stats.name),
    subtitle: `github.com/${stats.name.toLowerCase()}`,
  });

  return card.render(`${rows}\n${rankSvg}`);
}
