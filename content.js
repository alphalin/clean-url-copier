(function () {
  // 完整的追蹤參數清單
  const TRACKING_PARAMS = [
    "fbclid", "gclid", "dclid", "utm_source", "utm_medium", 
    "utm_campaign", "utm_term", "utm_content", "mc_cid", 
    "mc_eid", "_hsenc", "_hsmi", "ref", "ref_src", "spm", 
    "igshid", "igsh", "xmt", "si"
  ];

  // 網址清理核心邏輯
  function cleanUrlText(text) {
    if (typeof text !== 'string') return text;
    
    return text.replace(/https?:\/\/[^\s"'<>]+/g, (match) => {
      try {
        const unescaped = match.replace(/&amp;/g, '&');
        const url = new URL(unescaped);
        let modified = false;

        TRACKING_PARAMS.forEach(p => {
          if (url.searchParams.has(p)) {
            url.searchParams.delete(p);
            modified = true;
          }
        });

        if (modified) {
          const cleaned = url.toString().replace(/(\?|&)$/, "");
          return match.includes('&amp;') ? cleaned.replace(/&/g, '&amp;') : cleaned;
        }
      } catch (e) {}
      return match;
    });
  }

  // -------------------------------------------------------------
  // 1. 攔截現代 Clipboard API (如 Threads)
  // -------------------------------------------------------------
  if (navigator.clipboard) {
    if (navigator.clipboard.write) {
      const originalWrite = navigator.clipboard.write.bind(navigator.clipboard);
      navigator.clipboard.write = function (items) {
        try {
          const processedItems = items.map((item) => {
            const newTypes = {};
            for (const type of item.types) {
              if (type === 'text/plain' || type === 'text/html') {
                newTypes[type] = item.getType(type).then(async (blob) => {
                  const text = await blob.text();
                  return new Blob([cleanUrlText(text)], { type });
                });
              } else {
                newTypes[type] = item.getType(type);
              }
            }
            return new ClipboardItem(newTypes);
          });
          return originalWrite(processedItems);
        } catch (err) {
          return originalWrite(items);
        }
      };
    }

    if (navigator.clipboard.writeText) {
      const originalWriteText = navigator.clipboard.writeText.bind(navigator.clipboard);
      navigator.clipboard.writeText = function (text) {
        return originalWriteText(cleanUrlText(text));
      };
    }
  }

  // -------------------------------------------------------------
  // 2. 攔截 DOM `copy` 事件（針對 Instagram 等使用 execCommand 的網站）
  //    關鍵：完全不去修改 DOM input/textarea，只修改剪貼簿資料
  // -------------------------------------------------------------
  document.addEventListener('copy', (event) => {
    if (!event.clipboardData) return;

    // 嘗試從 ClipboardEvent 或當前 Selection 中拿到即將被寫入的文字
    let originalText = '';

    // 如果網頁腳本已經在 clipboardData 寫入了資料，直接讀取並清洗
    try {
      originalText = event.clipboardData.getData('text/plain');
    } catch (e) {}

    // 如果 clipboardData 還是空的，讀取目前選取的文字或 activeElement 的內容
    if (!originalText) {
      originalText = window.getSelection().toString();
      const activeEl = document.activeElement;
      if (!originalText && activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        originalText = activeEl.value;
      }
    }

    if (originalText) {
      const cleaned = cleanUrlText(originalText);
      // 當確認裡面有追蹤參數網址時，才覆寫剪貼簿
      if (cleaned !== originalText) {
        event.preventDefault();
        event.clipboardData.setData('text/plain', cleaned);
      }
    }
  }, true); // 使用 Capture 階段，優先攔截
})();
