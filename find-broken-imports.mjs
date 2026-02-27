#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const workspaceRoot = '/workspaces/prana3.0';
const srcPath = path.join(workspaceRoot, 'src');

// Function to resolve import paths
function resolvePath(importPath, fromFile) {
  if (importPath.startsWith('@/')) {
    const resolvedPath = importPath.replace('@/', srcPath + '/');
    return resolveFullPath(resolvedPath);
  } else if (importPath.startsWith('./') || importPath.startsWith('../')) {
    const dir = path.dirname(fromFile);
    const resolvedPath = path.resolve(dir, importPath);
    return resolveFullPath(resolvedPath);
  }
  return null;
}

// Function to resolve with extensions
function resolveFullPath(baseImportPath) {
  const extensions = ['', '.js', '.jsx', '.ts', '.tsx', '/index.js', '/index.jsx', '/index.ts', '/index.tsx'];
  
  for (const ext of extensions) {
    const fullPath = baseImportPath + ext;
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }
  
  return baseImportPath;
}

// Extract import statements from file content
function extractImports(fileContent) {
  const imports = [];
  const importRegex = /import\s+(?:(?:\{[^}]*\})|(?:\*\s+as\s+\w+)|(?:\w+))?(?:\s+from)?\s+['"]([@.][^'"]+)['"]/g;
  
  let match;
  while ((match = importRegex.exec(fileContent)) !== null) {
    imports.push(match[1]);
  }
  
  return imports;
}

// Get all source files
function getAllSourceFiles() {
  try {
    const output = execSync('find /workspaces/prana3.0 -type f \\( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \\) 2>/dev/null', {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024
    });
    return output.trim().split('\n').filter(f => f && !f.includes('node_modules') && !f.includes('.mjs'));
  } catch (e) {
    return [];
  }
}

// Main analysis
function analyzeImports() {
  console.log('🔍 Scanning for broken imports...\n');
  
  const files = getAllSourceFiles();
  const brokenImports = [];
  let processedFiles = 0;
  
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    
    try {
      const content = fs.readFileSync(file, 'utf8');
      const imports = extractImports(content);
      
      for (const importPath of imports) {
        // Skip external packages (except @ and . prefixed)
        if (!importPath.startsWith('@/') && !importPath.startsWith('.')) {
          continue;
        }
        
        const resolvedPath = resolvePath(importPath, file);
        
        if (resolvedPath && !fs.existsSync(resolvedPath)) {
          brokenImports.push({
            file: file.replace(workspaceRoot, ''),
            importPath,
            expectedPath: resolvedPath.replace(workspaceRoot, '')
          });
        }
      }
      processedFiles++;
    } catch (e) {
      // Skip files that can't be read
    }
  }
  
  // Print results
  console.log(`Processed ${processedFiles} files\n`);
  
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
    
    // Sort files alphabetically
    const sortedFiles = Object.keys(byFile).sort();
    
    for (const file of sortedFiles) {
      console.log(`\n📄 ${file}`);
      const uniqueImports = new Set();
      
      for (const broken of byFile[file]) {
        const importStr = `import ... from '${broken.importPath}'`;
        if (!uniqueImports.has(importStr)) {
          uniqueImports.add(importStr);
          console.log(`   ❌ import ... from '${broken.importPath}'`);
          console.log(`      Expected: ${broken.expectedPath}\n`);
        }
      }
    }
  }
  
  return brokenImports;
}

analyzeImports();
