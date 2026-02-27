#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const workspaceRoot = '/workspaces/prana3.0';
const srcPath = path.join(workspaceRoot, 'src');

// Parse vite.config.js to get alias configuration
function getAliasConfig() {
  try {
    const viteConfigPath = path.join(workspaceRoot, 'vite.config.js');
    const configContent = fs.readFileSync(viteConfigPath, 'utf8');
    // Extract the alias from vite.config.js
    // @ -> src is a common default
    return {
      '@': srcPath
    };
  } catch (e) {
    return { '@': srcPath };
  }
}

const aliases = getAliasConfig();

// Function to resolve import paths
function resolvePath(importPath, fromFile) {
  if (importPath.startsWith('@/')) {
    // Replace @ with src alias
    const resolvedPath = importPath.replace('@/', srcPath + '/');
    return resolveFullPath(resolvedPath);
  } else if (importPath.startsWith('./') || importPath.startsWith('../')) {
    // Relative import
    const dir = path.dirname(fromFile);
    const resolvedPath = path.resolve(dir, importPath);
    return resolveFullPath(resolvedPath);
  }
  return null; // node_modules or other external imports
}

// Function to resolve with extensions
function resolveFullPath(baseImportPath) {
  // Try different extensions
  const extensions = ['', '.js', '.jsx', '.ts', '.tsx', '/index.js', '/index.jsx', '/index.ts', '/index.tsx'];
  
  for (const ext of extensions) {
    const fullPath = baseImportPath + ext;
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }
  
  return baseImportPath; // Return original if not found (will be marked as broken)
}

// Extract import statements from file
function extractImports(fileContent) {
  const imports = [];
  
  // Match ES6 import statements
  const importRegex = /import\s+(?:(?:\{[^}]*\})|(?:\*\s+as\s+\w+)|(?:\w+))?(?:\s+from)?\s+['"]([@.][^'"]+)['"]/g;
  
  let match;
  while ((match = importRegex.exec(fileContent)) !== null) {
    imports.push(match[1]);
  }
  
  return imports;
}

// Main analysis
function analyzeImports() {
  console.log('🔍 Scanning for broken imports...\n');
  
  glob(path.join(srcPath, '**/*.{js,jsx,ts,tsx}'), (err, files) => {
    if (err) {
      console.error('Error globbing files:', err);
      return;
    }

    const brokenImports = [];
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const imports = extractImports(content);
      
      for (const importPath of imports) {
        const resolvedPath = resolvePath(importPath, file);
        
        // Check if it's an internal import that should be resolved
        if (resolvedPath && !importPath.match(/^[a-z]+/)) {
          if (!fs.existsSync(resolvedPath)) {
            brokenImports.push({
              file: file.replace(workspaceRoot, ''),
              importStatement: `import ... from '${importPath}'`,
              expectedPath: resolvedPath.replace(workspaceRoot, ''),
              importPath: importPath
            });
          }
        }
      }
    } catch (e) {
      console.error(`Error reading ${file}:`, e.message);
    }
  }
  
  // Also check API and DB files
  const extraFiles = [
    path.join(workspaceRoot, 'src/api/**/*.js'),
    path.join(workspaceRoot, 'db/**/*.js'),
    path.join(workspaceRoot, 'src/ai_services/**/*.js')
  ];
  
  for (const pattern of extraFiles) {
    const expandedFiles = await glob(pattern);
    
    for (const file of expandedFiles) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const imports = extractImports(content);
        
        for (const importPath of imports) {
          const resolvedPath = resolvePath(importPath, file);
          
          if (resolvedPath && !importPath.match(/^[a-z]+/)) {
            if (!fs.existsSync(resolvedPath)) {
              brokenImports.push({
                file: file.replace(workspaceRoot, ''),
                importStatement: `import ... from '${importPath}'`,
                expectedPath: resolvedPath.replace(workspaceRoot, ''),
                importPath: importPath
              });
            }
          }
        }
      } catch (e) {
        // Skip read errors
      }
    }
  }
  
  // Print results
  if (brokenImports.length === 0) {
    console.log('✅ No broken imports found!');
  } else {
    console.log(`❌ Found ${brokenImports.length} broken imports:\n`);
    
    // Group by file
    const byFile = {};
    for (const broken of brokenImports) {
      if (!byFile[broken.file]) {
        byFile[broken.file] = [];
      }
      byFile[broken.file].push(broken);
    }
    
    for (const file of Object.keys(byFile).sort()) {
      console.log(`📄 ${file}`);
      for (const broken of byFile[file]) {
        console.log(`   ❌ ${broken.importStatement}`);
        console.log(`      Expected: ${broken.expectedPath}`);
      }
      console.log('');
    }
  }
  
  return brokenImports;
}

analyzeImports().catch(console.error);
