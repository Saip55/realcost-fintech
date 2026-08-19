import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, "..");

const candidateAssetsDirs = [
  path.join(rootDir, "dist", "client", "assets"),
  path.join(rootDir, ".output", "public", "assets"),
  path.join(rootDir, "dist", "assets"),
];

let assetsDir = null;

for (const cand of candidateAssetsDirs) {
  if (fs.existsSync(cand)) {
    assetsDir = cand;
    break;
  }
}

if (!assetsDir) {
  console.error(
    "❌ Assets directory not found in dist/client/assets, .output/public/assets, or dist/assets.",
  );
  process.exit(1);
}

console.log(`🔍 Found assets in: ${assetsDir}`);

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

const publishDirs = [
  path.join(rootDir, "dist"),
  path.join(rootDir, "dist", "client"),
  path.join(rootDir, ".output", "public"),
];

for (const pDir of publishDirs) {
  if (!fs.existsSync(pDir)) {
    fs.mkdirSync(pDir, { recursive: true });
  }
  fs.writeFileSync(path.join(pDir, "index.html"), htmlContent, "utf-8");
  const pAssets = path.join(pDir, "assets");
  if (pAssets !== assetsDir) {
    fs.cpSync(assetsDir, pAssets, { recursive: true });
  }
  console.log(`✅ Generated index.html and synced assets to: ${pDir}`);
}
