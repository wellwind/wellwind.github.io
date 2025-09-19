const fs = require('fs');
const path = require('path');

const distRoot = path.resolve(__dirname, '../dist');
const projectRoot = path.resolve(distRoot, '..', '..');
const projectSrcRoot = path.join(projectRoot, 'src');

const aliasPatterns = [
  { match: '@features/', isPrefix: true, target: path.join(distRoot, 'src/features') },
  { match: '@features', isPrefix: false, target: path.join(distRoot, 'src/features/index') },
  { match: '@shared/core/', isPrefix: true, target: path.join(distRoot, 'src/shared/core') },
  { match: '@shared/core', isPrefix: false, target: path.join(distRoot, 'src/shared/core/index') },
];

function resolveAlias(specifier) {
  for (const pattern of aliasPatterns) {
    if (pattern.isPrefix) {
      if (specifier.startsWith(pattern.match)) {
        return path.join(pattern.target, specifier.slice(pattern.match.length));
      }
    } else if (specifier === pattern.match) {
      return pattern.target;
    }
  }
  return null;
}

function toRelative(filePath, absolutePath) {
  let relative = path.relative(path.dirname(filePath), absolutePath);
  if (!relative.startsWith('.')) {
    relative = `./${relative}`;
  }
  return relative.replace(/\\/g, '/');
}

function rewriteFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const updated = content.replace(/require\((['"])([^'"]+)\1\)/g, (match, quote, specifier) => {
    const resolved = resolveAlias(specifier);
    if (!resolved) {
      return match;
    }
    const relativeSpecifier = toRelative(filePath, resolved);
    return `require(${quote}${relativeSpecifier}${quote})`;
  });

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
  }
}

function walk(dir, callback) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(entryPath, callback);
    } else if (entry.isFile()) {
      callback(entryPath);
    }
  }
}

function rewriteDistRequires() {
  if (!fs.existsSync(distRoot)) {
    return;
  }

  walk(distRoot, filePath => {
    if (filePath.endsWith('.js')) {
      rewriteFile(filePath);
    }
  });
}

function cleanupProjectArtifacts() {
  const targets = [
    path.join(projectSrcRoot, 'features'),
    path.join(projectSrcRoot, 'shared')
  ];

  for (const target of targets) {
    if (!fs.existsSync(target)) {
      continue;
    }

    walk(target, filePath => {
      if (filePath.endsWith('.js')) {
        const tsPath = filePath.slice(0, -3) + '.ts';
        if (fs.existsSync(tsPath)) {
          fs.rmSync(filePath);
        }
      } else if (filePath.endsWith('.js.map')) {
        const tsPath = filePath.slice(0, -7) + '.ts';
        if (fs.existsSync(tsPath)) {
          fs.rmSync(filePath);
        }
      }
    });
  }
}

rewriteDistRequires();
cleanupProjectArtifacts();
