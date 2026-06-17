# 三脉 · 儒释道倾向测评

通过 18 道情境题，凭第一直觉探索你内心更亲近儒、释、道哪一脉。

**版本：1.0.0** — 上线就绪

## 产品特性

- **18 道本质型情境题**：覆盖关系伦理、内心功课、处世态度、生命观四大维度
- **深度结果解读**：主倾向 + 混合倾向 + 四维度分面 + 日常修习建议 + 阴影提醒
- **乔布斯式极简 UI**：留白、克制、移动端优先、深色模式、减少动效
- **上线就绪**：SEO / PWA / 离线缓存 / 404 / 部署校验脚本

## 本地运行

```bash
cd ru-shi-dao
python3 -m http.server 8080 --bind 0.0.0.0
```

## 部署前校验

```bash
node scripts/validate.js
```

## 部署上线

| 平台 | 操作 |
|------|------|
| **Vercel** | 导入仓库，根目录即站点（含 `vercel.json`） |
| **Netlify** | 连接 Git 或拖拽文件夹（含 `netlify.toml`） |
| **GitHub Pages** | 推送 main 分支，启用 GitHub Actions（含 workflow） |

## 上线检查清单

- [x] 18 道题目，每题 3 选项、权重完整
- [x] 四维度分面计分与结果展示
- [x] 引导页说明作答方式与三脉简介
- [x] 上一题 / 键盘快捷键 / 无障碍（aria-live、focus、skip link）
- [x] 隐私声明：数据不上传，纯本地计算
- [x] SEO：meta、Open Graph、JSON-LD、robots.txt、sitemap.xml
- [x] PWA：manifest + Service Worker 离线缓存
- [x] 404 页面、安全响应头（Netlify）
- [x] 部署校验脚本 `scripts/validate.js`

## 文件结构

| 文件 | 说明 |
|------|------|
| `config.js` | 版本号、维度分组配置 |
| `questions.js` | 题库、三脉文案、混合倾向 |
| `app.js` | 流程控制、计分、结果渲染 |
| `index.html` | 四屏结构（欢迎/引导/问答/结果） |
| `styles.css` | 视觉与动效 |
| `scripts/validate.js` | 部署前校验 |

## 免责声明

本测评仅供自我探索参考，不构成心理诊断或专业建议。
