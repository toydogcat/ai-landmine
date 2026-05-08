# 15 MINES — Cyber Minesweeper 💣⚡

> 一款基於 React + TypeScript + Tailwind CSS v4 與 Framer Motion 打造、極致精美且富有科技感的未來風「踩地雷」遊戲。全面支援 PWA (Progressive Web App) 技術，無論是電腦、Android 或是 iOS 手機，皆可「一鍵安裝至主畫面」並支援**完全離線遊玩**！

💻 **線上即玩**：[https://toydogcat.github.io/ai-landmine/](https://toydogcat.github.io/ai-landmine/)

---

## ✨ 遊戲特色

- 🌌 **黑客暗黑美學**：極致簡約的碳黑（`#0A0A0A`）背景，配上高飽和度的螢光綠（`#C1FF00`），展現濃厚科幻終端機視覺感受。
- 📱 **PWA 支援（離線可玩）**：完全離線快取，在飛機上、捷運中、無網路環境下，依然能流暢開打。
- ⚙️ **高度客製化**：
  - 自訂網格寬度與高度（5x5 ~ 30x30）。
  - 自訂地雷總數（會為您顯示即時**地雷密度百分比**）。
  - 即時自適應渲染，極速初始化地圖。
- 🎬 **絲滑動畫**：使用 `framer-motion` 打造精緻的結算彈窗與滑鼠懸停微互動。
- 🧭 **行動端最佳化**：完美支援手機長按「插旗」、單指點擊「翻開」，並提供禁止縮放最佳體驗。

---

## 📲 PWA 行動端 / 電腦版安裝指南

### 1. iOS (iPhone / iPad) 🍏
1. 使用 **Safari** 瀏覽器開啟遊戲網址：`https://toydogcat.github.io/ai-landmine/`
2. 點擊瀏覽器下方的 **「分享」** 按鈕 (帶有向上箭頭的方框)。
3. 在選單中向下滑動，選擇 **「加入主畫面」 (Add to Home Screen)**。
4. 點擊右上角 **「新增」**。遊戲圖標即會出現在您的手機桌面上，點開即享全螢幕、無網址列的 native APP 體驗！

### 2. Android (三星/小米/Pixel 等) 🤖
1. 使用 **Chrome** 瀏覽器開啟遊戲網址。
2. 點擊瀏覽器右上角的 **「三個點」** 選單。
3. 點擊 **「安裝應用程式」 (Install App)** 或 **「新增至主畫面」**。
4. 依提示完成安裝，即可在桌面和 App 抽屜中隨時點開。

### 3. 電腦端 (Windows / macOS / Linux) 💻
1. 使用 Chrome / Edge 瀏覽器開啟網址。
2. 觀察網址列右側，會出現一個 **「螢幕加箭頭」的安裝圖標** 🖥️。
3. 點擊並選擇 **「安裝」**，遊戲即會變成獨立的視窗應用程式。

---

## 🛠️ 本地開發與啟動說明

要在本機進行開發、擴充或測試：

### 前置需求
確保您的電腦已安裝 [Node.js](https://nodejs.org/) (建議 v18+ 或 v20+)。

### 1. 安裝專案依賴
```bash
npm install
```

### 2. 啟動本地開發伺服器 (Dev Server)
```bash
npm run dev
```
啟動後在瀏覽器開啟 `http://localhost:3000` 即可進行開發與即時預覽。

### 3. 本地打包編譯
```bash
npm run build
```
將會使用 Vite + `vite-plugin-pwa` 進行編譯，並在 `dist/` 資料夾中生成所有的靜態檔案，包含 `registerSW.js`、`manifest.webmanifest`、`sw.js` 等 PWA 離線快取服務。


