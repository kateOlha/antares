import fs from "node:fs";

const files = [
  "client/src/data.ts",
  "client/src/components/Layout.tsx",
];

for (const file of files) {
  let s = fs.readFileSync(file, "utf8");
  if (!s.includes('from "../assets"') && !s.includes('from "./assets"')) {
    const importPath = file.includes("/components/") ? "../assets" : "./assets";
    s = `import { asset } from "${importPath}";\n${s}`;
  }
  s = s.replace(/(src|icon|image)=["']\/images\/([^"']+)["']/g, (_, attr, path) => {
    return `${attr}={asset("/images/${path}")}`;
  });
  // object props: icon: "/images/..."
  s = s.replace(/((?:icon|image):\s*)"(\/images\/[^"]+)"/g, "$1asset(\"$2\")");
  fs.writeFileSync(file, s);
  console.log("fixed", file);
}
