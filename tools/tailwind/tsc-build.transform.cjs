const fs = require('fs');
const path = require('path');
const { parse } = require('./parse.cjs');
const { expandVariantGroup } = require('./expand-variant-group.cjs');

const LIB_DIR = path.join(process.cwd(), 'lib');

function processFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.error(`❌ Directory not found: ${dir}`);
    return;
  }

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processFiles(fullPath);
    } else if (file.endsWith('.js')) {
      processFile(fullPath);
    }
  }
}

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    const updatedContent = expandVariantGroup(content, match => {
      return parse(match);
    });

    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`✔ Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing file: ${filePath}`, error);
  }
}

console.log(`🔍 Scanning .js files in ${LIB_DIR}...`);
processFiles(LIB_DIR);
console.log('✔ Processing complete!');
