/**
 * 三脉 · 儒释道倾向测评
 * 欢迎 → 引导 → 逐题作答 → 深度结果
 */

(function () {
  'use strict';

  const screens = {
    welcome: document.getElementById('screen-welcome'),
    intro: document.getElementById('screen-intro'),
    quiz: document.getElementById('screen-quiz'),
    result: document.getElementById('screen-result'),
  };

  const els = {
    btnStart: document.getElementById('btn-start'),
    btnIntroNext: document.getElementById('btn-intro-next'),
    btnPrev: document.getElementById('btn-prev'),
    btnRestart: document.getElementById('btn-restart'),
    btnShare: document.getElementById('btn-share'),
    progressFill: document.getElementById('progress-fill'),
    progressBar: document.getElementById('progress-bar'),
    progressLabel: document.getElementById('progress-label'),
    questionDimension: document.getElementById('question-dimension'),
    questionText: document.getElementById('question-text'),
    choices: document.getElementById('choices'),
    resultAnnouncer: document.getElementById('result-announcer'),
    resultTitle: document.getElementById('result-title'),
    resultBlend: document.getElementById('result-blend'),
    resultDesc: document.getElementById('result-desc'),
    resultDeep: document.getElementById('result-deep'),
    resultShadow: document.getElementById('result-shadow'),
    resultQuote: document.getElementById('result-quote'),
    resultPractices: document.getElementById('result-practices'),
    resultFacets: document.getElementById('result-facets'),
    barRu: document.getElementById('bar-ru'),
    barShi: document.getElementById('bar-shi'),
    barDao: document.getElementById('bar-dao'),
    pctRu: document.getElementById('pct-ru'),
    pctShi: document.getElementById('pct-shi'),
    pctDao: document.getElementById('pct-dao'),
    appVersion: document.getElementById('app-version'),
  };

  let currentIndex = 0;
  /** @type {Record<string, number>} */
  let scores = { ru: 0, shi: 0, dao: 0 };
  /** @type {Record<string, Record<string, number>>} */
  let facetScores = {};
  /** @type {number[]} */
  let answerHistory = [];
  let isTransitioning = false;
  /** @type {{ dominant: string, pcts: Record<string, number> } | null} */
  let lastResult = null;

  function initFacetScores() {
    facetScores = {};
    Object.keys(FACETS).forEach((facet) => {
      facetScores[facet] = { ru: 0, shi: 0, dao: 0 };
    });
  }

  function setText(el, text) {
    if (el) el.textContent = text;
  }

  /** @param {'welcome'|'intro'|'quiz'|'result'} name */
  function showScreen(name) {
    Object.entries(screens).forEach(([key, el]) => {
      const active = key === name;
      el.hidden = !active;
      el.classList.toggle('screen--active', active);
      el.classList.toggle('screen--exit', !active);
    });
  }

  function resetQuiz() {
    currentIndex = 0;
    scores = { ru: 0, shi: 0, dao: 0 };
    initFacetScores();
    answerHistory = [];
    isTransitioning = false;
    lastResult = null;
  }

  function updateProgress() {
    const total = QUESTIONS.length;
    const current = currentIndex + 1;
    const pct = Math.round((currentIndex / total) * 100);
    els.progressFill.style.width = `${pct}%`;
    els.progressBar.setAttribute('aria-valuenow', String(pct));
    setText(els.progressLabel, `${current} / ${total}`);
    els.btnPrev.disabled = currentIndex === 0;
  }

  function renderQuestion() {
    const q = QUESTIONS[currentIndex];
    setText(els.questionDimension, q.dimension);
    setText(els.questionText, q.text);
    els.choices.innerHTML = '';

    q.choices.forEach((choice, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'choice';
      btn.setAttribute('role', 'option');
      btn.setAttribute('aria-label', `选项 ${i + 1}：${choice.text}`);
      btn.setAttribute('data-index', String(i));
      btn.style.animationDelay = `${i * 0.06}s`;

      const span = document.createElement('span');
      span.className = 'choice__text';
      span.textContent = choice.text;
      btn.appendChild(span);

      btn.addEventListener('click', () => handleChoice(choice, i));
      els.choices.appendChild(btn);
    });

    updateProgress();
    els.questionText.classList.remove('question-text--in');
    els.questionDimension.classList.remove('question-text--in');
    void els.questionText.offsetWidth;
    els.questionText.classList.add('question-text--in');
    els.questionDimension.classList.add('question-text--in');

    const firstChoice = els.choices.querySelector('.choice');
    if (firstChoice) firstChoice.focus();
  }

  function applyChoice(choice, question) {
    scores.ru += choice.weights.ru;
    scores.shi += choice.weights.shi;
    scores.dao += choice.weights.dao;

    const facet = question.facet;
    if (facetScores[facet]) {
      facetScores[facet].ru += choice.weights.ru;
      facetScores[facet].shi += choice.weights.shi;
      facetScores[facet].dao += choice.weights.dao;
    }
  }

  function revertChoice(choiceIndex) {
    const question = QUESTIONS[currentIndex];
    const choice = question.choices[choiceIndex];
    if (!choice) return;

    scores.ru -= choice.weights.ru;
    scores.shi -= choice.weights.shi;
    scores.dao -= choice.weights.dao;

    const facet = question.facet;
    if (facetScores[facet]) {
      facetScores[facet].ru -= choice.weights.ru;
      facetScores[facet].shi -= choice.weights.shi;
      facetScores[facet].dao -= choice.weights.dao;
    }
  }

  /** @param {{ weights: Record<string, number> }} choice */
  function handleChoice(choice, choiceIndex) {
    if (isTransitioning) return;
    isTransitioning = true;

    if (answerHistory[currentIndex] !== undefined) {
      revertChoice(answerHistory[currentIndex]);
    }

    answerHistory[currentIndex] = choiceIndex;
    applyChoice(choice, QUESTIONS[currentIndex]);

    const screen = screens.quiz;
    screen.classList.add('screen--fade-out');

    window.setTimeout(() => {
      currentIndex += 1;
      if (currentIndex >= QUESTIONS.length) {
        showResults();
      } else {
        screen.classList.remove('screen--fade-out');
        renderQuestion();
        isTransitioning = false;
      }
    }, 320);
  }

  function goPrevious() {
    if (currentIndex === 0 || isTransitioning) return;
    currentIndex -= 1;
    renderQuestion();
  }

  function computePercentages(rawScores) {
    const total = rawScores.ru + rawScores.shi + rawScores.dao;
    if (total === 0) return { ru: 33, shi: 33, dao: 34 };
    return {
      ru: Math.round((rawScores.ru / total) * 100),
      shi: Math.round((rawScores.shi / total) * 100),
      dao: Math.round((rawScores.dao / total) * 100),
    };
  }

  /** @param {Record<string, number>} pcts */
  function normalizePercentages(pcts) {
    const ranked = getRanked(pcts);
    const sum = pcts.ru + pcts.shi + pcts.dao;
    if (sum !== 100) {
      pcts[ranked[0].key] += 100 - sum;
    }
    return pcts;
  }

  /** @param {Record<string, number>} pcts */
  function getRanked(pcts) {
    return /** @type {const} */ (['ru', 'shi', 'dao'])
      .map((key) => ({ key, pct: pcts[key] }))
      .sort((a, b) => b.pct - a.pct);
  }

  /** @param {Record<string, number>} pcts */
  function getBlendHint(pcts) {
    const ranked = getRanked(pcts);
    const gapTop = ranked[0].pct - ranked[1].pct;
    const gapBottom = ranked[1].pct - ranked[2].pct;

    if (gapTop <= APP_CONFIG.blendGapThreshold && gapBottom <= APP_CONFIG.blendGapThreshold) {
      return BALANCED_HINT;
    }
    if (gapTop > APP_CONFIG.blendGapThreshold) return null;

    const pair = [ranked[0].key, ranked[1].key].sort().join('-');
    return BLEND_HINTS[pair] || null;
  }

  /** @param {Record<string, number>} rawScores */
  function getDominantFromScores(rawScores) {
    const pcts = computePercentages(rawScores);
    return getRanked(pcts)[0].key;
  }

  function renderFacetBreakdown() {
    if (!els.resultFacets) return;
    els.resultFacets.innerHTML = '';

    Object.entries(FACETS).forEach(([key, meta]) => {
      const raw = facetScores[key] || { ru: 0, shi: 0, dao: 0 };
      const total = raw.ru + raw.shi + raw.dao;
      if (total === 0) return;

      const dominant = getDominantFromScores(raw);
      const info = TRADITIONS[dominant];

      const row = document.createElement('div');
      row.className = 'facet-row';

      const label = document.createElement('span');
      label.className = 'facet-row__label';
      label.textContent = meta.label;

      const value = document.createElement('span');
      value.className = 'facet-row__value';
      value.textContent = `偏${info.name}`;
      value.style.color = info.color;

      row.appendChild(label);
      row.appendChild(value);
      els.resultFacets.appendChild(row);
    });
  }

  function renderPractices(practices) {
    if (!els.resultPractices) return;
    els.resultPractices.innerHTML = '';

    practices.forEach((tip) => {
      const li = document.createElement('li');
      li.textContent = tip;
      els.resultPractices.appendChild(li);
    });
  }

  function showResults() {
    const pcts = normalizePercentages(computePercentages(scores));
    const ranked = getRanked(pcts);
    const dominant = ranked[0].key;
    const info = TRADITIONS[dominant];
    const blend = getBlendHint(pcts);

    lastResult = { dominant, pcts };

    setText(els.resultTitle, `更亲近「${info.full}」`);
    setText(els.resultBlend, blend || '');
    els.resultBlend.hidden = !blend;
    setText(els.resultDesc, info.description);
    setText(els.resultDeep, info.deepInsight);
    setText(els.resultShadow, info.shadow);
    setText(els.resultQuote, info.quote);
    renderPractices(info.practices);
    renderFacetBreakdown();

    const announce = `测评完成。您更亲近${info.full}。儒${pcts.ru}%，释${pcts.shi}%，道${pcts.dao}%。`;
    setText(els.resultAnnouncer, announce);

    const bars = [
      { el: els.barRu, pct: els.pctRu, key: 'ru' },
      { el: els.barShi, pct: els.pctShi, key: 'shi' },
      { el: els.barDao, pct: els.pctDao, key: 'dao' },
    ];

    showScreen('result');

    bars.forEach(({ el, pct, key }) => {
      el.style.width = '0%';
      el.style.backgroundColor = TRADITIONS[key].color;
      setText(pct, '0%');
    });

    window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        bars.forEach(({ el, pct, key }) => {
          const v = pcts[key];
          el.style.width = `${v}%`;
          setText(pct, `${v}%`);
        });
      }, 400);
    });
  }

  async function shareResult() {
    if (!lastResult) return;

    const { dominant, pcts } = lastResult;
    const info = TRADITIONS[dominant];
    const shareText = `三脉测评：我更亲近「${info.full}」（儒 ${pcts.ru}% · 释 ${pcts.shi}% · 道 ${pcts.dao}%）`;
    const shareUrl = window.location.href.split('#')[0];

    try {
      if (navigator.share) {
        await navigator.share({
          title: APP_CONFIG.name,
          text: shareText,
          url: shareUrl,
        });
        return;
      }
    } catch (err) {
      if (err && err.name === 'AbortError') return;
    }

    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setText(els.btnShare, '已复制');
      window.setTimeout(() => setText(els.btnShare, '分享结果'), 2000);
    } catch {
      window.prompt('复制以下结果分享给朋友：', `${shareText}\n${shareUrl}`);
    }
  }

  function validateQuestions() {
    if (!Array.isArray(QUESTIONS) || QUESTIONS.length === 0) {
      throw new Error('题库为空');
    }
    QUESTIONS.forEach((q) => {
      if (!q.choices || q.choices.length !== 3) {
        throw new Error(`题目 ${q.id} 选项数量异常`);
      }
    });
  }

  els.btnStart.addEventListener('click', () => {
    resetQuiz();
    showScreen('intro');
  });

  els.btnIntroNext.addEventListener('click', () => {
    showScreen('quiz');
    renderQuestion();
  });

  els.btnPrev.addEventListener('click', goPrevious);

  els.btnRestart.addEventListener('click', () => {
    resetQuiz();
    showScreen('welcome');
  });

  els.btnShare.addEventListener('click', shareResult);

  document.addEventListener('keydown', (e) => {
    if (!screens.quiz.classList.contains('screen--active') || isTransitioning) return;

    if (e.key === 'Backspace' && !e.target.closest('input, textarea')) {
      e.preventDefault();
      goPrevious();
      return;
    }

    const num = parseInt(e.key, 10);
    if (num >= 1 && num <= 3) {
      const q = QUESTIONS[currentIndex];
      const choice = q.choices[num - 1];
      if (choice) handleChoice(choice, num - 1);
    }
  });

  try {
    validateQuestions();
    initFacetScores();
    if (els.appVersion) {
      setText(els.appVersion, `v${APP_CONFIG.version}`);
    }
  } catch (err) {
    console.error(err);
    document.body.innerHTML =
      '<main style="padding:2rem;font-family:serif;text-align:center"><h1>加载失败</h1><p>题库校验未通过，请刷新或联系维护者。</p></main>';
    return;
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }
})();
