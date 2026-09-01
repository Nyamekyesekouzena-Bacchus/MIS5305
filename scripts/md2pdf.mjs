// One-off helper: convert the Section-3 evidence Markdown files to PDF.
// Generated as part of the testing/evaluation cycle (run after `npm test`).
// Usage: node scripts/md2pdf.mjs   (or import { renderPdf, DOCS } from here)
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

export const DOCS = [
  "docs/test-evidence.md",
  "docs/heuristic-evaluation.md",
  "docs/usability-testing.md",
];

// Minimal, dependency-free Markdown -> HTML good enough for these reports
// (headings, GFM tables, blockquotes, lists, code, bold/italic, links).
function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function inline(s) {
  return esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<a>$1</a>");
}
function mdToHtml(md) {
  const lines = md.split("\n");
  const out = [];
  let i = 0;
  const flushTable = (rows) => {
    if (rows.length < 2) {
      for (const r of rows) out.push(`<p>${inline(r)}</p>`);
      return;
    }
    const cells = (r) =>
      r.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
    out.push("<table>");
    out.push(
      "<thead><tr>" +
        cells(rows[0]).map((c) => `<th>${inline(c)}</th>`).join("") +
        "</tr></thead>"
    );
    out.push("<tbody>");
    for (let r = 2; r < rows.length; r++) {
      out.push(
        "<tr>" +
          cells(rows[r]).map((c) => `<td>${inline(c)}</td>`).join("") +
          "</tr>"
      );
    }
    out.push("</tbody></table>");
  };
  while (i < lines.length) {
    let line = lines[i];
    if (/^\s*$/.test(line)) {
      i++;
      continue;
    }
    if (line.startsWith("```")) {
      const buf = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) buf.push(lines[i++]);
      i++;
      out.push(`<pre><code>${esc(buf.join("\n"))}</code></pre>`);
      continue;
    }
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const n = h[1].length;
      out.push(`<h${n}>${inline(h[2])}</h${n}>`);
      i++;
      continue;
    }
    if (/^\s*[-*]\s+/.test(line)) {
      out.push("<ul>");
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        out.push(`<li>${inline(lines[i].replace(/^\s*[-*]\s+/, ""))}</li>`);
        i++;
      }
      out.push("</ul>");
      continue;
    }
    if (line.startsWith(">")) {
      const buf = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        buf.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      out.push(`<blockquote>${inline(buf.join(" "))}</blockquote>`);
      continue;
    }
    if (line.trim().startsWith("|")) {
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(lines[i].trim());
        i++;
      }
      flushTable(rows);
      continue;
    }
    if (/^---+$/.test(line.trim())) {
      out.push("<hr/>");
      i++;
      continue;
    }
    out.push(`<p>${inline(line)}</p>`);
    i++;
  }
  return out.join("\n");
}

const CSS = `
  body{font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#1b1b1b;
       font-size:11px;line-height:1.45;margin:0}
  h1{font-size:20px;border-bottom:2px solid #2c7a4b;padding-bottom:6px;color:#1f5c39}
  h2{font-size:15px;margin-top:18px;color:#1f5c39;border-bottom:1px solid #ddd;padding-bottom:3px}
  h3{font-size:13px;margin-top:14px;color:#333}
  table{border-collapse:collapse;width:100%;margin:8px 0;font-size:10px}
  th,td{border:1px solid #bbb;padding:4px 6px;text-align:left;vertical-align:top}
  th{background:#eef5f0}
  tr:nth-child(even) td{background:#fafafa}
  code{background:#f0f0f0;padding:1px 4px;border-radius:3px;font-size:10px}
  pre{background:#f6f8fa;border:1px solid #ddd;border-radius:4px;padding:8px;overflow:auto}
  pre code{background:none;padding:0}
  blockquote{border-left:4px solid #2c7a4b;background:#f3f9f5;margin:8px 0;padding:6px 12px;color:#333}
  a{color:#1f5c39;text-decoration:none}
  hr{border:none;border-top:1px solid #ddd;margin:14px 0}
`;

// Render a single Markdown file to a PDF next to it (same name, .pdf).
export function renderPdf(rel) {
  const md = readFileSync(rel, "utf8");
  const html = `<!doctype html><html><head><meta charset="utf-8">
<style>${CSS}</style></head><body>${mdToHtml(md)}</body></html>`;
  const tmp = join(tmpdir(), rel.split("/").pop().replace(/\.md$/, ".html"));
  writeFileSync(tmp, html);
  const pdf = rel.replace(/\.md$/, ".pdf");
  execFileSync(
    "wkhtmltopdf",
    [
      "--enable-local-file-access",
      "--margin-top", "16mm",
      "--margin-bottom", "16mm",
      "--margin-left", "14mm",
      "--margin-right", "14mm",
      "--footer-right", "[page]/[topage]",
      "--footer-font-size", "8",
      tmp,
      pdf,
    ],
    { stdio: "inherit" }
  );
  console.log("wrote", pdf);
  return pdf;
}

export function renderAll(docs = DOCS) {
  for (const rel of docs) renderPdf(rel);
}

// Run all docs when executed directly (node scripts/md2pdf.mjs).
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  renderAll();
}
