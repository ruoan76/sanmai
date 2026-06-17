/**
 * 三脉 · 儒释道倾向测评题库
 * 每题切入内在冲突，选项不暴露哲学标签，凭第一直觉作答
 */
const TRADITIONS = {
  ru: {
    name: '儒',
    full: '儒家',
    color: '#8B4513',
    essence: '仁义礼智，担纲立序',
    quote: '「士不可以不弘毅，任重而道远。」—— 《论语》',
    description:
      '你内心更亲近「入世担当」：在关系与责任中确立自我，相信诚意正心、行有所止，方能立得住、对得起所爱与所信。',
    deepInsight:
      '你的底层驱动力是「有所担当」——在伦理秩序中确认自己是谁。你往往通过兑现承诺、维护公义、照顾他人来获得内在安定。这不是功利，而是一种存在方式：人之所以为人，在于能对得起。',
    shadow:
      '留意是否把「应该」看得过重——有时对秩序的执着，也会变成对自己的苛责，或在关系中过度承担。',
    practices: [
      '每日一问：今日之事，是否对得起所爱与所信？',
      '在冲突中先问「分寸在哪里」，再行动',
      '以「修身」为起点：先正己，再正事',
    ],
    keywords: ['责任', '信义', '秩序', '担当', '礼'],
  },
  shi: {
    name: '释',
    full: '佛家',
    color: '#D4A574',
    essence: '观照离苦，慈悲为本',
    quote: '「应无所住而生其心。」—— 《金刚经》',
    description:
      '你内心更亲近「向内觉悟」：重视苦的觉察与执着的松脱，相信看清心的运作，比向外追逐更能带来真正的自由。',
    deepInsight:
      '你的底层驱动力是「看清与放下」——不被情绪、欲望和恐惧牵着走。你倾向于在事件背后看见心的运作，以慈悲对待自他。自由对你而言，不是得到什么，而是不再被什么绑住。',
    shadow:
      '留意是否以「放下」回避必要的行动——有些责任仍需在世间完成，觉悟不等于缺席。',
    practices: [
      '欲望或愤怒升起时，先命名它，再决定跟不跟',
      '每日留出片刻，只是呼吸，不做事',
      '对他人的苦，先理解再评判',
    ],
    keywords: ['觉察', '慈悲', '无常', '放下', '离苦'],
  },
  dao: {
    name: '道',
    full: '道家',
    color: '#2F6B5E',
    essence: '道法自然，守真任运',
    quote: '「知其不可奈何而安之若命，德之至也。」—— 《庄子》',
    description:
      '你内心更亲近「顺势守真」：相信万物有其节律，不强求、不拧巴，以柔软与本真融入天地，反而接近智慧。',
    deepInsight:
      '你的底层驱动力是「守真与顺势」——不跟世界硬碰，也不背叛自己的本性。你往往在「少即是多」里找到力量，在流动与简朴中感到自在。智慧对你而言，是知道何时进、何时退、何时什么都不做。',
    shadow:
      '留意是否以「随缘」回避该承担的选择——有些时刻，仍需发出自己的声音。',
    practices: [
      '感到拧巴时，问：我是在强求，还是在守真？',
      '每周留出时间亲近自然，什么都不产出',
      '以「水」为镜：利万物而不争',
    ],
    keywords: ['自然', '本真', '顺势', '简朴', '无为'],
  },
};

/**
 * @typedef {'ru'|'shi'|'dao'} Tradition
 * @typedef {'relation'|'inner'|'conduct'|'lifeview'} Facet
 * @typedef {{ text: string, weights: Record<Tradition, number> }} Choice
 * @typedef {{ id: number, facet: Facet, dimension: string, text: string, choices: Choice[] }} Question
 */

/** @type {Question[]} */
const QUESTIONS = [
  {
    id: 1,
    facet: 'inner',
    dimension: '深夜独白',
    text: '深夜独自清醒，最先涌上心头的，往往是——',
    choices: [
      { text: '我是否辜负了某个具体的人或承诺', weights: { ru: 3, shi: 0, dao: 0 } },
      { text: '拼命抓住的一切，终究留不住', weights: { ru: 0, shi: 3, dao: 1 } },
      { text: '宇宙如此辽阔，我的焦虑显得多余', weights: { ru: 0, shi: 1, dao: 3 } },
    ],
  },
  {
    id: 2,
    facet: 'conduct',
    dimension: '被误解',
    text: '被重要的人严重误解，你的第一直觉是——',
    choices: [
      { text: '必须把话说清，还彼此一个公道', weights: { ru: 3, shi: 0, dao: 0 } },
      { text: '先感受这股委屈，看它如何升起、如何消退', weights: { ru: 0, shi: 3, dao: 1 } },
      { text: '越解释越纠缠，不如交给时间', weights: { ru: 0, shi: 1, dao: 3 } },
    ],
  },
  {
    id: 3,
    facet: 'inner',
    dimension: '恐惧之核',
    text: '你最怕活成哪一种人？',
    choices: [
      { text: '背信弃义、令亲友蒙羞的人', weights: { ru: 3, shi: 0, dao: 0 } },
      { text: '被恐惧和欲望驱使、永不得安宁的人', weights: { ru: 0, shi: 3, dao: 0 } },
      { text: '背离本性、活得很假很累的人', weights: { ru: 0, shi: 0, dao: 3 } },
    ],
  },
  {
    id: 4,
    facet: 'relation',
    dimension: '失去',
    text: '一个重要的人或阶段彻底离去，你如何安放自己？',
    choices: [
      { text: '把该尽的礼做完，把该记住的留住', weights: { ru: 3, shi: 1, dao: 0 } },
      { text: '允许悲伤，同时看见「诸行无常」', weights: { ru: 0, shi: 3, dao: 1 } },
      { text: '像水一样，让生命继续流向下一段', weights: { ru: 0, shi: 1, dao: 3 } },
    ],
  },
  {
    id: 5,
    facet: 'relation',
    dimension: '两难抉择',
    text: '陷入两难，必须立刻做出选择，你更依赖——',
    choices: [
      { text: '原则与分寸：什么该做、什么绝不可为', weights: { ru: 3, shi: 0, dao: 0 } },
      { text: '减少伤害：哪条路对更多生命更慈悲', weights: { ru: 1, shi: 3, dao: 0 } },
      { text: '顺势而动：此刻心最轻、最真的那一步', weights: { ru: 0, shi: 1, dao: 3 } },
    ],
  },
  {
    id: 6,
    facet: 'conduct',
    dimension: '重大挫败',
    text: '经历一次彻底的失败之后，你更可能——',
    choices: [
      { text: '复盘责任，重新站起，把欠的补回来', weights: { ru: 3, shi: 0, dao: 1 } },
      { text: '从失败里看见执念，学会与苦共处', weights: { ru: 0, shi: 3, dao: 0 } },
      { text: '先歇一歇，等时节到了再自然重启', weights: { ru: 0, shi: 1, dao: 3 } },
    ],
  },
  {
    id: 7,
    facet: 'conduct',
    dimension: '权力与规则',
    text: '面对明显不合理的权力或规则，你内心更接近——',
    choices: [
      { text: '该发声就发声，公义不可沉默', weights: { ru: 3, shi: 0, dao: 0 } },
      { text: '理解对方的苦，仍温和而坚定地拒绝伤害', weights: { ru: 1, shi: 3, dao: 0 } },
      { text: '以柔克刚，绕行比硬碰更智慧', weights: { ru: 0, shi: 1, dao: 3 } },
    ],
  },
  {
    id: 8,
    facet: 'inner',
    dimension: '欲望涌起',
    text: '强烈欲望突然涌起（占有、报复、炫耀……），你会——',
    choices: [
      { text: '克制：不因私欲伤害他人与名节', weights: { ru: 3, shi: 1, dao: 0 } },
      { text: '观照：看清它从哪来，不跟着它走', weights: { ru: 0, shi: 3, dao: 1 } },
      { text: '任它流过：堵不如疏，不必与之为敌', weights: { ru: 0, shi: 1, dao: 3 } },
    ],
  },
  {
    id: 9,
    facet: 'inner',
    dimension: '孤独',
    text: '长久独处、无人倾诉时，你更常——',
    choices: [
      { text: '用读书、规划、做事填满时间', weights: { ru: 3, shi: 1, dao: 0 } },
      { text: '与空性相处，练习不依赖外在回应', weights: { ru: 0, shi: 3, dao: 1 } },
      { text: '走向自然，在风物里找回自己的节奏', weights: { ru: 0, shi: 1, dao: 3 } },
    ],
  },
  {
    id: 10,
    facet: 'lifeview',
    dimension: '临终一念',
    text: '若生命只剩最后一年，你最想确保的是——',
    choices: [
      { text: '该了的事、该谢的人、该还的情，一一了结', weights: { ru: 3, shi: 0, dao: 0 } },
      { text: '心无挂碍，不再被得失与恐惧牵引', weights: { ru: 0, shi: 3, dao: 1 } },
      { text: '活得更真、更简，与天地好好道别', weights: { ru: 0, shi: 1, dao: 3 } },
    ],
  },
  {
    id: 11,
    facet: 'relation',
    dimension: '传承',
    text: '若只能教一个孩子一件事，你会选——',
    choices: [
      { text: '言而有信，对人对事有担当', weights: { ru: 3, shi: 0, dao: 0 } },
      { text: '不伤害，也尽量不让他人的苦成为自己的苦', weights: { ru: 1, shi: 3, dao: 0 } },
      { text: '做你自己，不必活成别人期待的样子', weights: { ru: 0, shi: 1, dao: 3 } },
    ],
  },
  {
    id: 12,
    facet: 'lifeview',
    dimension: '不可控',
    text: '面对完全不可控的危机（疾病、变故、时代洪流），你更依赖——',
    choices: [
      { text: '稳住阵脚，先护住最该护的人', weights: { ru: 3, shi: 0, dao: 1 } },
      { text: '接纳无常，在恐惧中保持觉察', weights: { ru: 0, shi: 3, dao: 1 } },
      { text: '相信大势有它的流向，我只需守本分', weights: { ru: 0, shi: 1, dao: 3 } },
    ],
  },
  {
    id: 13,
    facet: 'conduct',
    dimension: '比较评判',
    text: '被公开比较、评判，你的内在反应更接近——',
    choices: [
      { text: '用更扎实的行动，证明我值得被尊重', weights: { ru: 3, shi: 0, dao: 0 } },
      { text: '他人的眼是镜，我不必把镜中相当作我', weights: { ru: 0, shi: 3, dao: 1 } },
      { text: '水本无形，比较越多，越偏离自己', weights: { ru: 0, shi: 1, dao: 3 } },
    ],
  },
  {
    id: 14,
    facet: 'lifeview',
    dimension: '成功定义',
    text: '抛开社会标准，你心底真正渴望的成功是——',
    choices: [
      { text: '问心无愧，对得起所爱与所信', weights: { ru: 3, shi: 0, dao: 0 } },
      { text: '从焦虑与执念中解脱，心能安住', weights: { ru: 0, shi: 3, dao: 0 } },
      { text: '活得真实、轻盈，与万物和谐同游', weights: { ru: 0, shi: 0, dao: 3 } },
    ],
  },
  {
    id: 15,
    facet: 'inner',
    dimension: '第一直觉',
    text: '以下哪句话，最像你会在无人时对自己说的——',
    choices: [
      { text: '「我可以慢，但不能对不住。」', weights: { ru: 3, shi: 0, dao: 0 } },
      { text: '「看清它，别被它带走。」', weights: { ru: 0, shi: 3, dao: 0 } },
      { text: '「顺其自然，我本来就够。」', weights: { ru: 0, shi: 0, dao: 3 } },
    ],
  },
  {
    id: 16,
    facet: 'relation',
    dimension: '亲密冲突',
    text: '与最亲近的人发生激烈冲突，你更可能——',
    choices: [
      { text: '先顾全关系的底线，再谈谁对谁错', weights: { ru: 3, shi: 1, dao: 0 } },
      { text: '看见双方背后的苦，不急于定罪', weights: { ru: 0, shi: 3, dao: 1 } },
      { text: '各自冷静，等情绪退潮后再说', weights: { ru: 1, shi: 1, dao: 3 } },
    ],
  },
  {
    id: 17,
    facet: 'lifeview',
    dimension: '金钱观',
    text: '关于金钱，你内心最真实的说法是——',
    choices: [
      { text: '钱是责任能力的延伸，不可轻慢道义', weights: { ru: 3, shi: 0, dao: 0 } },
      { text: '够用就好，贪念是苦的源头', weights: { ru: 0, shi: 3, dao: 1 } },
      { text: '够用即可，不必为钱扭曲本性', weights: { ru: 0, shi: 1, dao: 3 } },
    ],
  },
  {
    id: 18,
    facet: 'lifeview',
    dimension: '衰老终点',
    text: '想到衰老与终点，你最深的感受是——',
    choices: [
      { text: '这一生是否留下了值得被记住的善', weights: { ru: 3, shi: 0, dao: 0 } },
      { text: '生死如幻，重要的是此刻是否清明', weights: { ru: 0, shi: 3, dao: 1 } },
      { text: '来也自然，去也自然，不必强留', weights: { ru: 0, shi: 1, dao: 3 } },
    ],
  },
];

/** 混合倾向文案 */
const BLEND_HINTS = {
  'ru-shi': '你兼具「入世担当」与「向内觉悟」——既重情义与分寸，也愿观照内心、减少伤害。',
  'ru-dao': '你兼具「入世担当」与「顺势守真」——既有原则与责任，也保留一份不拧巴的自在。',
  'shi-dao': '你兼具「向内觉悟」与「顺势守真」——既观照执念，也信任生命自有流向。',
};

/** 三脉均衡时的特殊文案 */
const BALANCED_HINT =
  '三脉较为均衡——你并非单一路径的人。在不同情境下，你可能分别调用儒的担当、释的觉察、道的顺势。';
