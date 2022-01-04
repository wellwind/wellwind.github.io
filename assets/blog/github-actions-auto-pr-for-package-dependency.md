---
title: "[GitHub Actions] 當有套件建議更新時自動發送 PR"
date: 2022-01-14 22:20:00
category: "GitHub Actions Snippets"
tags:
  - "GitHub Actions"
---

今天從 [Jimmy 哥](https://jiaming0708.github.io/) 那邊學到的新招，透過 [Dependabot](https://github.com/dependabot) 及 GitHub Actions，可以在相依套件有更新時自動發送 PR。

<!-- more -->

```yaml
version: 2
updates:
- package-ecosystem: npm # 除了 npm 以外，基本上相容所有常見的套件系統
  directory: "/"
  schedule:
    interval: daily
  open-pull-requests-limit: 20
```

搭配[自動發送 Telegram 訊息功能](https://fullstackladder.dev/blog/2021/11/01/github-actions-send-telegram/)，還可以即時去同意 PR，以免有 PR 卻沒更新；只要調整觸發條件就好。

```yaml
on:
  pull_request:
    types: [opened, reopened]
```

另外值得注意的是，bot 發送的 body 內容很長會造成 Telegram 訊息發不出去，可以考慮保留 link 就好，不要加入 body，訊息範本：

```yaml
message: |
  Author: ${{ github.event.pull_request.user.login }}
  Title: ${{ github.event.pull_request.title }}
  Link: ${{ github.event.pull_request.html_url }}
  Merge branch: from ${{ github.event.pull_request.head.ref }} to ${{ github.event.pull_request.base.ref }}
```

# 相關資源

* [Dependabot](https://github.com/dependabot)
* [Configuration options for dependency updates](https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically/configuration-options-for-dependency-updates)
