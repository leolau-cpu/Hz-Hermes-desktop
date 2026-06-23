import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const foregroundPath = join(root, "src-tauri", "icon-foreground.svg");
const composedSvgPath = join(root, "src-tauri", "app-icon-composed.svg");
const sourcePngPath = join(root, "src-tauri", "app-icon-source.png");
const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const foreground = readFileSync(foregroundPath, "utf8");
const svgBody = foreground
  .replace(/^.*?<svg[^>]*>/s, "")
  .replace(/<\/svg>\s*$/s, "");

const composed = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M512 100C744.72 100 795.25 100 865.14 158.74C924 228.71 924 279.46 924 512C924 744.54 924 795.29 865.14 865.26C795.25 924 744.72 924 512 924C279.28 924 228.75 924 158.86 865.26C100 795.29 100 744.54 100 512C100 279.46 100 228.71 158.86 158.74C228.75 100 279.28 100 512 100Z" fill="#000000"/>
  <g transform="translate(221 221) scale(0.78)">
    ${svgBody}
  </g>
</svg>
`;

writeFileSync(composedSvgPath, composed);

const renderDir = mkdtempSync(join(tmpdir(), "hz-hermes-icon-"));
const renderedPath = join(renderDir, "app-icon-composed.png");
execFileSync(chromePath, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--force-device-scale-factor=1",
  "--window-size=1024,1024",
  "--default-background-color=00000000",
  `--screenshot=${renderedPath}`,
  `file://${composedSvgPath}`,
], { stdio: "ignore" });
execFileSync("/bin/cp", [renderedPath, sourcePngPath]);
execFileSync("/bin/cp", [sourcePngPath, join(root, "src-tauri", "app-icon.png")]);
execFileSync(join(root, "node_modules", ".bin", "tauri"), [
  "icon",
  join(root, "src-tauri", "app-icon.png"),
  "-o",
  join(root, "src-tauri", "icons"),
], { stdio: "inherit" });
