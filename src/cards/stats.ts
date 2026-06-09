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

const ROW_H = 24;

interface Metric {
  icon: string;
  value: number;
  label: string;
}

function metricRow(
  m: Metric,
  x: number,
  y: number,
  iconColor: string,
  textColor: string,
): string {
  const icon = `<svg x="${x}" y="${y}" width="14" height="14" viewBox="0 0 16 16" fill="#${iconColor}" opacity="0.7">${m.icon}</svg>`;
  const numX = x + 20;
  const labelX = x + 52;
  return `${icon}
<text x="${numX}" y="${y + 12}" font-size="14" font-weight="700" font-family="${FONT}" fill="#${textColor}">${kFormatter(m.value)}</text>
<text x="${labelX}" y="${y + 12}" font-size="12" font-family="${FONT}" fill="#${textColor}" opacity="0.6">${m.label}</text>`;
}

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

  const impactMetrics: Metric[] = [
    { icon: icons.star, value: stats.totalStars, label: "Stars" },
    { icon: icons.contribs, value: stats.contributedTo, label: "Contribs" },
  ];

  const activityMetrics: Metric[] = [
    { icon: icons.commits, value: stats.totalCommits, label: "Commits" },
    { icon: icons.prs, value: stats.totalPRs, label: "Pull Requests" },
    { icon: icons.issues, value: stats.totalIssues, label: "Issues" },
  ];

  const showRank = !options.hideRank;
  const cardWidth = 480;
  const p = 24;

  const headerH = 44;
  const sepY = headerH + 4;
  const sectionLabelY = sepY + 18;
  const firstRowY = sectionLabelY + 14;
  const maxRows = Math.max(impactMetrics.length, activityMetrics.length);
  const bodyH = maxRows * ROW_H;
  const cardHeight = firstRowY + bodyH + p;

  const leftColX = p;
  const rightColX = Math.floor(cardWidth / 2) + 10;

  const sectionLabelStyle = `font-size="10" font-weight="600" font-family="${FONT}" fill="#${theme.text_color}" opacity="0.35" letter-spacing="1.5"`;

  let headerRight = "";
  if (showRank) {
    const rankR = 26;
    const rankCx = cardWidth - p - rankR - 8;
    const rankCy = 24 + rankR;
    const circ = 2 * Math.PI * rankR;
    const filled = ((100 - rank.percentile) / 100) * circ;
    headerRight = `<circle cx="${rankCx}" cy="${rankCy}" r="${rankR}" fill="none" stroke="#${theme.text_color}" stroke-width="4" opacity="0.06"/>
<circle cx="${rankCx}" cy="${rankCy}" r="${rankR}" fill="none" stroke="#${theme.ring_color}" stroke-width="4" stroke-linecap="round" stroke-dasharray="${circ}" stroke-dashoffset="${circ - filled}" transform="rotate(-90 ${rankCx} ${rankCy})"/>
<text x="${rankCx}" y="${rankCy + 1}" text-anchor="middle" font-size="11" font-weight="600" font-family="${FONT}" fill="#${theme.text_color}" opacity="0.45">RANK</text>
<text x="${rankCx}" y="${rankCy + 15}" text-anchor="middle" font-size="14" font-weight="800" font-family="${FONT}" fill="#${theme.text_color}">${rank.level}</text>`;
  }

  const impactRows = impactMetrics
    .map((m, i) => metricRow(m, leftColX, firstRowY + i * ROW_H, theme.icon_color, theme.text_color))
    .join("\n");

  const activityRows = activityMetrics
    .map((m, i) => metricRow(m, rightColX, firstRowY + i * ROW_H, theme.icon_color, theme.text_color))
    .join("\n");

  const body = `<text x="${p}" y="${p + 16}" font-size="16" font-weight="600" font-family="${FONT}" fill="#${theme.title_color}">${encodeHTML(stats.name)}</text>
<text x="${p}" y="${p + 32}" font-size="11" font-family="${FONT}" fill="#${theme.text_color}" opacity="0.4">@${stats.login}</text>
${headerRight}
<line x1="${p}" y1="${sepY}" x2="${cardWidth - p}" y2="${sepY}" stroke="#${theme.text_color}" stroke-width="0.5" opacity="0.1"/>
<text x="${leftColX}" y="${sectionLabelY}" ${sectionLabelStyle}>IMPACT</text>
<text x="${rightColX}" y="${sectionLabelY}" ${sectionLabelStyle}>ACTIVITY</text>
${impactRows}
${activityRows}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}" role="img">
  <rect x="0.5" y="0.5" width="${cardWidth - 1}" height="99%" rx="4.5" fill="#${theme.bg_color}" stroke="#${theme.border_color}"/>
  ${body}
</svg>`;
}
