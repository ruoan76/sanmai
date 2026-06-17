/** 站点全局配置 */
const APP_CONFIG = {
  version: '1.0.1',
  name: '三脉 · 儒释道倾向测评',
  questionCount: 18,
  estimatedMinutes: 5,
  blendGapThreshold: 12,
};

/** 维度分组：用于结果页分面解读 */
const FACETS = {
  relation: { label: '关系伦理', desc: '面对他人、承诺与情感连结时的本能取向' },
  inner: { label: '内心功课', desc: '独处、欲望与情绪涌起时的内在反应' },
  conduct: { label: '处世态度', desc: '面对冲突、权力与外界评判时的行动倾向' },
  lifeview: { label: '生命观', desc: '对成功、失去、衰老与有限性的底层态度' },
};
