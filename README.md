# Clean URL Copier (Chrome Extension)

一個輕量、注重隱私的 Chrome 擴充功能（Manifest V3）。當你在網頁上點擊「複製連結」或「分享」按鈕時，自動清除網址中帶有的各類追蹤參數（如 `utm_*`, `fbclid`, `igsh` 等），確保剪貼簿中的網址保持乾淨。

---

## ✨ 特色功能

- **自動無感過濾**：攔截網頁複製行為，貼出時即為乾淨網址。
- **全方位機制支援**：同時支援現代 `navigator.clipboard` (ClipboardItem) API 與舊式 `document.execCommand` 複製機制。
- **輕量與極致隱私**：採用 Manifest V3 與 `MAIN` world 注入，**不需要額外的讀寫剪貼簿權限**，也不會蒐集任何個人資料。

---

## 🧪 已測試驗證平台

本擴充功能已特別針對以下採用特殊/複雜複製機制的平台進行測試與適配，點擊按鈕複製皆能穩定自動清理：

- **Instagram** (針對背景建立隱藏 DOM input + `execCommand` 複製機制適配)
- **Threads** (針對現代 `ClipboardItem` 複合資料寫入機制適配)
- 一般帶有追蹤參數（如 `utm_*`）的各大常見新聞與文章網站

---

## 🛠️ 安裝教學 (開發者模式)

1. **下載專案**：複製或下載本儲存庫至你的電腦。
2. **開啟擴充功能頁面**：開啟 Chrome / Edge 瀏覽器，在網址列輸入 `chrome://extensions/` 並按下 Enter。
3. **啟用開發者模式**：切換頁面右上角的 **「開發者模式」(Developer mode)** 開關為開啟狀態。
4. **載入擴充功能**：點擊左上角的 **「載入未打包項目」(Load unpacked)**，選擇含有 `manifest.json` 的專案資料夾。
5. **開始使用**：重新整理目標網頁後即可生效！

---

## 🔍 目前支援清理的追蹤參數

包含但不限於：
- **Google / Marketing**: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`
- **Meta / Instagram / Threads**: `fbclid`, `igshid`, `igsh`, `xmt`
- **YouTube**: `si`
- **其他平台**: `dclid`, `mc_cid`, `mc_eid`, `_hsenc`, `_hsmi`, `ref`, `ref_src`, `spm`

> 💡 *若需要新增額外參數，只需修改 `content.js` 中的 `TRACKING_PARAMS` 陣列即可。*

---

## 📄 專案結構

```text
.
├── manifest.json   # 擴充功能設定檔 (Manifest V3)
├── content.js      # 核心攔截與清理腳本
├── LICENSE         # MIT 授權條款
└── README.md
