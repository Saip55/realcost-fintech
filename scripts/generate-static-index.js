import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, "..");
const outputPublicDir = path.join(rootDir, ".output", "public");
const assetsDir = path.join(outputPublicDir, "assets");

if (!fs.existsSync(assetsDir)) {
  console.warn("⚠️ Assets directory not found. Skipping static index generation.");
  process.exit(0);
}

const files = fs.readdirSync(assetsDir);
const jsFile = files.find((f) => f.startsWith("index-") && f.endsWith(".js"));
const cssFile = files.find((f) => f.startsWith("styles-") && f.endsWith(".css"));

if (!jsFile || !cssFile) {
  console.warn("⚠️ Could not find compiled index JS or styles CSS. Files:", files);
  process.exit(0);
}

const htmlContent = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>RealCost — Money is Time. See What Things Actually Cost.</title>
    <meta
      name="description"
      content="RealCost shows the hidden hours and future compounding value behind every purchase."
    />
    <link
      rel="icon"
      type="image/svg+xml"
      href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23121910'><path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'></path></svg>"
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" crossorigin href="/assets/${cssFile}">
  </head>
  <body class="bg-[#070c06] text-[#f1f7ed]">
    <div id="root"></div>
    <script type="module" crossorigin src="/assets/${jsFile}"></script>
  </body>
</html>
`;

fs.writeFileSync(path.join(outputPublicDir, "index.html"), htmlContent, "utf-8");
console.log(`✅ Generated static index.html in .output/public/ with JS: ${jsFile} and CSS: ${cssFile}`);

const distDir = path.join(rootDir, "dist");
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}
fs.writeFileSync(path.join(distDir, "index.html"), htmlContent, "utf-8");
fs.cpSync(assetsDir, path.join(distDir, "assets"), { recursive: true });
console.log(`✅ Copied static index.html and assets to dist/ directory for universal platform support.`);
