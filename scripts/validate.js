#!/usr/bin/env node
/**
 * 题库与配置校验脚本 — 部署前运行
 * 用法: node scripts/validate.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');

let errors = 0;

function fail(msg) {
  console.error('✗', msg);
  errors += 1;
}

function ok(msg) {
  console.log('✓', msg);
}

try {
  const sandbox = { console };
  vm.createContext(sandbox);
  const bundle = [
    fs.readFileSync(path.join(root, 'config.js'), 'utf8'),
    fs.readFileSync(path.join(root, 'questions.js'), 'utf8'),
    'this.QUESTIONS = QUESTIONS;',
    'this.TRADITIONS = TRADITIONS;',
    'this.APP_CONFIG = APP_CONFIG;',
    'this.FACETS = FACETS;',
  ].join('\n');
  vm.runInContext(bundle, sandbox);

  const { QUESTIONS, TRADITIONS, APP_CONFIG, FACETS } = sandbox;

  if (QUESTIONS.length !== APP_CONFIG.questionCount) {
    fail(`题目数量 ${QUESTIONS.length} 与 config ${APP_CONFIG.questionCount} 不一致`);
  } else {
    ok(`题目数量 ${QUESTIONS.length}`);
  }

  const facets = new Set(Object.keys(FACETS));
  QUESTIONS.forEach((q) => {
    if (q.choices.length !== 3) fail(`Q${q.id} 选项数不为 3`);
    if (!facets.has(q.facet)) fail(`Q${q.id} facet 无效: ${q.facet}`);
    q.choices.forEach((c, i) => {
      ['ru', 'shi', 'dao'].forEach((t) => {
        if (typeof c.weights[t] !== 'number') fail(`Q${q.id} 选项${i + 1} 缺少 ${t} 权重`);
      });
    });
  });
  ok('每题 3 选项、权重完整、facet 合法');

  ['ru', 'shi', 'dao'].forEach((t) => {
    const info = TRADITIONS[t];
    if (!info.practices || info.practices.length < 3) fail(`${t} 缺少 practices`);
    if (!info.deepInsight) fail(`${t} 缺少 deepInsight`);
  });
  ok('三脉结果文案完整');

  const requiredFiles = [
    'index.html', 'app.js', 'config.js', 'questions.js', 'styles.css',
    'manifest.webmanifest', 'sw.js', 'robots.txt', '404.html',
    'vercel.json', 'netlify.toml',
  ];
  requiredFiles.forEach((f) => {
    if (!fs.existsSync(path.join(root, f))) fail(`缺少文件 ${f}`);
  });
  ok('上线必需文件齐全');

  if (errors === 0) {
    console.log('\n全部校验通过，可以部署。');
    process.exit(0);
  } else {
    console.error(`\n${errors} 项校验失败。`);
    process.exit(1);
  }
} catch (err) {
  console.error('校验脚本异常:', err.message);
  process.exit(1);
}
