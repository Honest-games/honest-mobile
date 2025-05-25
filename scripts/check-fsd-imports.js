#!/usr/bin/env node

/**
 * Скрипт для проверки корректности импортов по FSD архитектуре
 * Запуск: node scripts/check-fsd-imports.js
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Определение слоев FSD от высшего к низшему
const layers = ['app', 'processes', 'pages', 'widgets', 'features', 'entities', 'shared'];

// Регулярное выражение для поиска импортов
const importRegex = /import\s+(?:(?:{[^}]*})|(?:[^{}\s,]+))\s+from\s+['"]@([^/]+)/g;

// Функция для проверки валидности импорта между слоями
function isValidImport(fromLayer, toLayer) {
  const fromIndex = layers.indexOf(fromLayer);
  const toIndex = layers.indexOf(toLayer);
  
  // Если какой-то из слоев не найден, это ошибка
  if (fromIndex === -1 || toIndex === -1) {
    return false;
  }
  
  // Слой может импортировать только из нижестоящих слоев
  return fromIndex <= toIndex;
}

// Функция для сканирования файла и поиска некорректных импортов
function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const layerMatch = filePath.match(/^([^/]+)/);
  
  if (!layerMatch) {
    return [];
  }
  
  const currentLayer = layerMatch[1];
  const violations = [];
  
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importedLayer = match[1];
    
    if (!isValidImport(currentLayer, importedLayer)) {
      violations.push({
        file: filePath,
        fromLayer: currentLayer,
        toLayer: importedLayer,
        importStatement: match[0],
      });
    }
  }
  
  return violations;
}

// Функция для сканирования директории
function scanDirectory(dir) {
  let violations = [];
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      violations = violations.concat(scanDirectory(filePath));
    } else if (
      stats.isFile() && 
      (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) &&
      !filePath.endsWith('.d.ts')
    ) {
      violations = violations.concat(checkFile(filePath));
    }
  }
  
  return violations;
}

// Запуск проверки
console.log('Checking FSD import rules...');

// Проверяем все директории FSD
const fsdDirs = [
  'app',
  'processes',
  'widgets',
  'features',
  'entities',
  'shared'
];

let allViolations = [];

for (const dir of fsdDirs) {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    const violations = scanDirectory(dirPath);
    allViolations = allViolations.concat(violations);
  }
}

if (allViolations.length === 0) {
  console.log('✅ All imports follow FSD architecture rules!');
} else {
  console.error(`❌ Found ${allViolations.length} violations of FSD architecture rules:`);
  
  for (const violation of allViolations) {
    console.error(`
File: ${violation.file}
Violation: Layer "${violation.fromLayer}" cannot import from higher layer "${violation.toLayer}"
Import: ${violation.importStatement}
    `);
  }
  
  process.exit(1);
} 