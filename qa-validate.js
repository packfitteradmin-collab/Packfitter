#!/usr/bin/env node
/**
 * PackFitter Page QA Validation Script
 * ─────────────────────────────────────
 * Scans all HTML files in the deploy directory and reports structural issues.
 * Does NOT modify any files.
 *
 * Usage:  node qa-validate.js
 * Flags:  --json   output raw JSON instead of formatted report
 *         --file=<name.html>  validate a single file only
 */

const fs = require('fs');
const path = require('path');

const DIR = __dirname; // assumes script lives in packfitter-deploy
const SITE_ORIGIN = 'https://packfitter.com';

// ── Helpers ──────────────────────────────────────────────────────────────────

function getAllHtmlFiles(dir, base = '') {
  let out = [];
  for (const e of fs.readdirSync(dir)) {
    if (e === 'node_modules' || e === '.git') continue;
    const fp = path.join(dir, e);
    const rel = base ? `${base}/${e}` : e;
    if (fs.statSync(fp).isDirectory() && e !== 'js' && e !== 'css') {
      out = out.concat(getAllHtmlFiles(fp, rel));
    } else if (e.endsWith('.html')) {
      out.push({ abs: fp, rel });
    }
  }
  return out;
}

const SEV = { ERROR: 'ERROR', WARN: 'WARN', INFO: 'INFO' };

class Issue {
  constructor(sev, category, file, line, msg, fix) {
    this.sev = sev;
    this.category = category;
    this.file = file;
    this.line = line;      // 0 = unknown / file-level
    this.msg = msg;
    this.fix = fix || '';
  }
}

// ── Collect files ────────────────────────────────────────────────────────────

const singleFile = (process.argv.find(a => a.startsWith('--file=')) || '').replace('--file=', '');
const jsonMode = process.argv.includes('--json');

const htmlFiles = getAllHtmlFiles(DIR).filter(f => {
  if (f.rel === 'qa-validate.js') return false; // skip self
  if (singleFile) return f.rel === singleFile || path.basename(f.rel) === singleFile;
  return true;
});

const issues = [];

// ── 1. Broken calculator anchors ─────────────────────────────────────────────

for (const { abs, rel } of htmlFiles) {
  const html = fs.readFileSync(abs, 'utf8');
  const lines = html.split('\n');
  const hasCalcId = /id\s*=\s*["']calculator["']/i.test(html);

  lines.forEach((line, i) => {
    // Match href="#calculator" (same-page anchor, not /#calculator)
    if (/href\s*=\s*["']#calculator["']/i.test(line) && !hasCalcId) {
      issues.push(new Issue(SEV.ERROR, '1-calc-anchor', rel, i + 1,
        'href="#calculator" points to non-existent same-page anchor',
        'Change to href="/#calculator" to link to the homepage calculator'));
    }
  });
}

// ── 2. Canonical issues ──────────────────────────────────────────────────────

for (const { abs, rel } of htmlFiles) {
  const html = fs.readFileSync(abs, 'utf8');
  const canonicals = [...html.matchAll(/<link\s+rel\s*=\s*["']canonical["'][^>]*href\s*=\s*["']([^"']+)["']/gi)];

  if (canonicals.length === 0) {
    issues.push(new Issue(SEV.ERROR, '2-canonical', rel, 0,
      'Missing canonical tag',
      `Add <link rel="canonical" href="${SITE_ORIGIN}/${rel}">`));
  } else if (canonicals.length > 1) {
    issues.push(new Issue(SEV.ERROR, '2-canonical', rel, 0,
      `Duplicate canonical tags (${canonicals.length} found)`,
      'Keep only one canonical tag'));
  } else {
    const url = canonicals[0][1];
    const expectedPath = rel.replace(/\\/g, '/');
    const expectedUrl = `${SITE_ORIGIN}/${expectedPath}`;
    if (url !== expectedUrl) {
      issues.push(new Issue(SEV.WARN, '2-canonical', rel, 0,
        `Canonical URL "${url}" does not match expected "${expectedUrl}"`,
        'Verify canonical matches the deployed file path'));
    }
  }
}

// ── 3. Sitemap issues ────────────────────────────────────────────────────────

const sitemapPath = path.join(DIR, 'sitemap.xml');
let sitemapUrls = new Set();
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const matches = sitemap.matchAll(/<loc>([^<]+)<\/loc>/g);
  for (const m of matches) {
    // Normalize to relative path
    const url = m[1].replace(SITE_ORIGIN + '/', '').replace(SITE_ORIGIN, '');
    sitemapUrls.add(url);
  }

  // HTML file missing from sitemap
  for (const { rel } of htmlFiles) {
    const normalized = rel.replace(/\\/g, '/');
    if (!sitemapUrls.has(normalized)) {
      issues.push(new Issue(SEV.WARN, '3-sitemap', rel, 0,
        'HTML file not listed in sitemap.xml',
        `Add <url><loc>${SITE_ORIGIN}/${normalized}</loc></url> to sitemap.xml`));
    }
  }

  // Sitemap URL with no matching HTML file
  const htmlSet = new Set(htmlFiles.map(f => f.rel.replace(/\\/g, '/')));
  for (const url of sitemapUrls) {
    if (url && !htmlSet.has(url)) {
      issues.push(new Issue(SEV.ERROR, '3-sitemap', 'sitemap.xml', 0,
        `Sitemap lists "${url}" but no matching HTML file exists`,
        'Remove stale entry or create the missing file'));
    }
  }
}

// ── 4. JSON-LD issues ────────────────────────────────────────────────────────

for (const { abs, rel } of htmlFiles) {
  const html = fs.readFileSync(abs, 'utf8');
  const jsonLdBlocks = [...html.matchAll(/<script\s+type\s*=\s*["']application\/ld\+json["']\s*>([\s\S]*?)<\/script>/gi)];

  for (const block of jsonLdBlocks) {
    const raw = block[1];
    const lineNum = html.substring(0, block.index).split('\n').length;

    // Invalid JSON
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      issues.push(new Issue(SEV.ERROR, '4-jsonld', rel, lineNum,
        `Invalid JSON-LD: ${e.message}`,
        'Fix JSON syntax'));
      continue;
    }

    // HTML tags inside JSON-LD values
    const jsonStr = JSON.stringify(parsed);
    if (/<[a-z][^>]*class\s*=\s*["']dim-/i.test(jsonStr)) {
      issues.push(new Issue(SEV.ERROR, '4-jsonld', rel, lineNum,
        'HTML dim-main/dim-secondary classes found inside JSON-LD',
        'JSON-LD must contain plain text only — remove HTML markup'));
    }
    if (/<(?:div|span|strong|em|a|p|ul|li|h[1-6])\b/i.test(jsonStr)) {
      issues.push(new Issue(SEV.WARN, '4-jsonld', rel, lineNum,
        'HTML tags detected inside JSON-LD values',
        'JSON-LD should generally contain plain text'));
    }

    // FAQPage schema: check structure
    if (parsed['@type'] === 'FAQPage') {
      if (!parsed.mainEntity || !Array.isArray(parsed.mainEntity)) {
        issues.push(new Issue(SEV.ERROR, '4-jsonld', rel, lineNum,
          'FAQPage schema missing or malformed mainEntity array',
          'Ensure mainEntity is an array of Question objects'));
      } else {
        for (let qi = 0; qi < parsed.mainEntity.length; qi++) {
          const q = parsed.mainEntity[qi];
          if (!q.name || typeof q.name !== 'string') {
            issues.push(new Issue(SEV.WARN, '4-jsonld', rel, lineNum,
              `FAQ question #${qi + 1} missing "name" field`,
              'Each question needs a "name" string'));
          }
          if (!q.acceptedAnswer || !q.acceptedAnswer.text) {
            issues.push(new Issue(SEV.WARN, '4-jsonld', rel, lineNum,
              `FAQ question #${qi + 1} missing acceptedAnswer.text`,
              'Each answer needs a "text" string'));
          }
        }
      }
    }
  }
}

// ── 5. Affiliate compliance ──────────────────────────────────────────────────

for (const { abs, rel } of htmlFiles) {
  const html = fs.readFileSync(abs, 'utf8');
  const lines = html.split('\n');

  lines.forEach((line, i) => {
    // Match any Amazon affiliate link
    if (/href\s*=\s*["']https?:\/\/amzn\.to\//i.test(line) ||
        /href\s*=\s*["']https?:\/\/(?:www\.)?amazon\.[^"']*(?:tag=|ref=)[^"']*/i.test(line)) {

      if (!/target\s*=\s*["']_blank["']/i.test(line)) {
        issues.push(new Issue(SEV.ERROR, '5-affiliate', rel, i + 1,
          'Amazon affiliate link missing target="_blank"',
          'Add target="_blank" to the <a> tag'));
      }
      if (!/rel\s*=\s*["'][^"']*nofollow[^"']*["']/i.test(line)) {
        issues.push(new Issue(SEV.ERROR, '5-affiliate', rel, i + 1,
          'Amazon affiliate link missing rel="nofollow"',
          'Add rel="nofollow sponsored noopener" to the <a> tag'));
      }
      if (!/rel\s*=\s*["'][^"']*sponsored[^"']*["']/i.test(line)) {
        issues.push(new Issue(SEV.ERROR, '5-affiliate', rel, i + 1,
          'Amazon affiliate link missing rel="sponsored"',
          'Ensure rel includes "sponsored"'));
      }
      if (!/rel\s*=\s*["'][^"']*noopener[^"']*["']/i.test(line)) {
        issues.push(new Issue(SEV.WARN, '5-affiliate', rel, i + 1,
          'Amazon affiliate link missing rel="noopener"',
          'Add "noopener" to rel for security'));
      }
    }
  });
}

// ── 6. FTC disclosure ────────────────────────────────────────────────────────

for (const { abs, rel } of htmlFiles) {
  const html = fs.readFileSync(abs, 'utf8');
  const hasAffiliate = /amzn\.to|amazon\.\w+.*(?:tag=|ref=)/i.test(html);
  const disclosures = (html.match(/Amazon\s+Associate/gi) || []).length;

  if (hasAffiliate && disclosures === 0) {
    issues.push(new Issue(SEV.ERROR, '6-ftc', rel, 0,
      'Page has affiliate links but no Amazon Associate disclosure',
      'Add FTC-required disclosure statement'));
  }
  if (hasAffiliate && disclosures > 1) {
    issues.push(new Issue(SEV.WARN, '6-ftc', rel, 0,
      `Duplicate Amazon Associate disclosures (${disclosures} found)`,
      'Keep exactly one disclosure per page'));
  }
  if (!hasAffiliate && disclosures > 0) {
    issues.push(new Issue(SEV.INFO, '6-ftc', rel, 0,
      'Page has Amazon Associate disclosure but no affiliate links',
      'Consider removing disclosure if no affiliate links exist'));
  }
}

// ── 7. Dimension bugs ────────────────────────────────────────────────────────

for (const { abs, rel } of htmlFiles) {
  const html = fs.readFileSync(abs, 'utf8');
  const lines = html.split('\n');

  // Track if we're inside a JSON-LD or meta block
  let inJsonLd = false;

  lines.forEach((line, i) => {
    if (line.includes('application/ld+json')) inJsonLd = true;
    if (inJsonLd && line.includes('</script>')) { inJsonLd = false; return; }
    if (inJsonLd) return;

    // 7a. Nested conversions: "unit (dims unit (dims unit))"
    if (/[\d.]+ × [\d.]+ × [\d.]+ (?:cm|in) \([\d.]+ × [\d.]+ × [\d.]+ (?:cm|in) \([\d.]+ × [\d.]+ × [\d.]+ (?:cm|in)\)\)/.test(line)) {
      issues.push(new Issue(SEV.ERROR, '7-dims', rel, i + 1,
        'Triple-nested dimension conversion detected',
        'Remove the innermost conversion layer'));
    }

    // 7b. Duplicate conversions: three full dim sets on one line (outside tables)
    const dimSets = line.match(/[\d.]+ × [\d.]+ × [\d.]+ (?:cm|in)/g);
    if (dimSets && dimSets.length >= 3 && !/<td/i.test(line) && !line.trim().startsWith('<meta')) {
      // Check if it's genuinely 3 of the SAME dimension (duplicate), not 3 different dims
      const unique = new Set(dimSets);
      if (unique.size < dimSets.length) {
        issues.push(new Issue(SEV.WARN, '7-dims', rel, i + 1,
          `Possible duplicate dimension on single line (${dimSets.length} dim sets, ${unique.size} unique)`,
          'Check for redundant dimension repetition'));
      }
    }

    // 7c. dim-main/dim-secondary in meta, title
    if (line.trim().startsWith('<meta') && /dim-(?:main|secondary)/.test(line)) {
      issues.push(new Issue(SEV.ERROR, '7-dims', rel, i + 1,
        'dim-main/dim-secondary class found in meta tag',
        'Meta tags must contain plain text'));
    }
    if (/<title[^>]*>.*dim-(?:main|secondary).*<\/title>/i.test(line)) {
      issues.push(new Issue(SEV.ERROR, '7-dims', rel, i + 1,
        'dim-main/dim-secondary class found in title tag',
        'Title tags must contain plain text'));
    }

    // 7d. Stacked dims outside table context
    if (/dim-main/.test(line) && !/<td/i.test(line)) {
      // Check previous line for multiline <td> context
      if (i > 0 && /<td/i.test(lines[i - 1]) && !/<\/td>/i.test(lines[i - 1])) return;
      issues.push(new Issue(SEV.WARN, '7-dims', rel, i + 1,
        'Stacked dim-main used outside table cell context',
        'Use inline "dims unit (dims unit)" format in non-table contexts'));
    }
  });

  // 7e. dim classes inside JSON-LD
  const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (jsonLdMatch && /dim-(?:main|secondary)/.test(jsonLdMatch[1])) {
    issues.push(new Issue(SEV.ERROR, '7-dims', rel, 0,
      'dim-main/dim-secondary found inside JSON-LD block',
      'JSON-LD must contain plain text only'));
  }
}

// ── 8. QA snapshot overflow ──────────────────────────────────────────────────

for (const { abs, rel } of htmlFiles) {
  const html = fs.readFileSync(abs, 'utf8');
  const lines = html.split('\n');

  lines.forEach((line, i) => {
    const qtyMatch = line.match(/class\s*=\s*["'][^"']*qa-snap-qty[^"']*["'][^>]*>([^<]*)</);
    if (qtyMatch) {
      const val = qtyMatch[1].trim();
      if (val.length > 18) {
        issues.push(new Issue(SEV.WARN, '8-qa-snap', rel, i + 1,
          `qa-snap-qty value "${val}" exceeds 18 characters (${val.length})`,
          'Shorten the quantity text to prevent layout overflow'));
      }
    }

    // Product names in qa-snap rows (look for brand-like patterns in snap rows)
    if (/qa-snap-row/.test(line) || (i > 0 && /qa-snap-row/.test(lines[i - 1]))) {
      if (/\b(?:Osprey|Tortuga|Cotopaxi|Matein|Travelpro|Samsonite|Away|Eagle Creek)\b/i.test(line)) {
        issues.push(new Issue(SEV.INFO, '8-qa-snap', rel, i + 1,
          'Product brand name found in QA snapshot row',
          'QA snapshots should use generic item names, not brand names'));
      }
    }
  });
}

// ── 9. OG tags ───────────────────────────────────────────────────────────────

for (const { abs, rel } of htmlFiles) {
  const html = fs.readFileSync(abs, 'utf8');

  if (!/property\s*=\s*["']og:title["']/i.test(html)) {
    issues.push(new Issue(SEV.WARN, '9-og', rel, 0,
      'Missing og:title meta tag',
      'Add <meta property="og:title" content="...">'));
  }
  if (!/property\s*=\s*["']og:description["']/i.test(html)) {
    issues.push(new Issue(SEV.WARN, '9-og', rel, 0,
      'Missing og:description meta tag',
      'Add <meta property="og:description" content="...">'));
  }
}

// ── 10. Duplicate IDs ────────────────────────────────────────────────────────

for (const { abs, rel } of htmlFiles) {
  const html = fs.readFileSync(abs, 'utf8');
  const idMatches = [...html.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)];
  const idMap = {};

  for (const m of idMatches) {
    const id = m[1];
    const lineNum = html.substring(0, m.index).split('\n').length;
    if (!idMap[id]) idMap[id] = [];
    idMap[id].push(lineNum);
  }

  for (const [id, lns] of Object.entries(idMap)) {
    if (lns.length > 1) {
      issues.push(new Issue(SEV.ERROR, '10-dup-id', rel, lns[0],
        `Duplicate id="${id}" (appears ${lns.length} times: lines ${lns.join(', ')})`,
        'Each id must be unique within a page'));
    }
  }
}

// ── Report ───────────────────────────────────────────────────────────────────

if (jsonMode) {
  console.log(JSON.stringify(issues, null, 2));
  process.exit(issues.some(i => i.sev === 'ERROR') ? 1 : 0);
}

const cats = {
  '1-calc-anchor': 'Broken Calculator Anchors',
  '2-canonical': 'Canonical Issues',
  '3-sitemap': 'Sitemap Issues',
  '4-jsonld': 'JSON-LD Issues',
  '5-affiliate': 'Affiliate Compliance',
  '6-ftc': 'FTC Disclosure',
  '7-dims': 'Dimension Bugs',
  '8-qa-snap': 'QA Snapshot Overflow',
  '9-og': 'OG Tags',
  '10-dup-id': 'Duplicate IDs',
};

const errors = issues.filter(i => i.sev === 'ERROR');
const warns = issues.filter(i => i.sev === 'WARN');
const infos = issues.filter(i => i.sev === 'INFO');

console.log('');
console.log('╔══════════════════════════════════════════════╗');
console.log('║   PackFitter QA Validation Report            ║');
console.log('╚══════════════════════════════════════════════╝');
console.log(`  Files scanned: ${htmlFiles.length}`);
console.log(`  Total issues:  ${issues.length} (${errors.length} errors, ${warns.length} warnings, ${infos.length} info)`);
console.log('');

// Group by severity, then category
for (const [sev, label, items] of [[SEV.ERROR, 'ERRORS', errors], [SEV.WARN, 'WARNINGS', warns], [SEV.INFO, 'INFO', infos]]) {
  if (items.length === 0) continue;

  console.log(`━━━ ${label} (${items.length}) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  // Group by category
  const byCat = {};
  for (const issue of items) {
    if (!byCat[issue.category]) byCat[issue.category] = [];
    byCat[issue.category].push(issue);
  }

  for (const [cat, catIssues] of Object.entries(byCat).sort()) {
    console.log(`\n  ┌─ ${cats[cat] || cat} (${catIssues.length})`);
    // Group by file for cleaner output
    const byFile = {};
    for (const issue of catIssues) {
      if (!byFile[issue.file]) byFile[issue.file] = [];
      byFile[issue.file].push(issue);
    }
    for (const [file, fileIssues] of Object.entries(byFile).sort()) {
      for (const issue of fileIssues) {
        const loc = issue.line ? `:${issue.line}` : '';
        console.log(`  │  ${file}${loc}`);
        console.log(`  │    → ${issue.msg}`);
        if (issue.fix) console.log(`  │    ✎ ${issue.fix}`);
      }
    }
    console.log('  └');
  }
  console.log('');
}

// Summary
console.log('─── Summary ────────────────────────────────────');
for (const [cat, label] of Object.entries(cats)) {
  const count = issues.filter(i => i.category === cat).length;
  const errCount = issues.filter(i => i.category === cat && i.sev === 'ERROR').length;
  const icon = count === 0 ? '✓' : errCount > 0 ? '✗' : '△';
  console.log(`  ${icon} ${label}: ${count === 0 ? 'clean' : `${count} issues (${errCount} errors)`}`);
}
console.log('');

process.exit(errors.length > 0 ? 1 : 0);
