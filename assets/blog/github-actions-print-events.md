---
title: "[GitHub Actions] 印出事件相關資訊"
date: 2021-11-01 16:37:00
category: "GitHub Actions Snippets"
tags:
  - "GitHub Actions"
---

當使用 GitHub Actions 時，經常要針對來源事件去進行一些額外處理，導致要去查詢事件相關屬性，非常不方便，可以使用 [Debug action](https://github.com/marketplace/actions/debug-action) 將相關資料印出，方便查找。

<!-- more -->

```yaml
jobs:
  debugAction:
    runs-on: ubuntu-latest

    steps:
      - uses: hmarr/debug-action@v2
```

當然，如果是設定成 secret 的內容，只會顯示一堆星號。

# 相關資源

* [GitHub Action - Debug action](https://github.com/marketplace/actions/debug-action)
