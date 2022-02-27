---
title: "[GitHub Actions] 自動關閉某個 bot 的 issues"
date: 2021-11-01 15:02:02
category: "GitHub Actions Snippets"
tags:
  - "GitHub Actions"
---

GitHub 非常的貼心，經常會發送一些 PR 或 issue 告訴我們目前的程式有漏洞有修補，或是我們自己寫的 bot，希望能在指定的條件下自動關閉，此時可以使用 [Close Issue]((https://github.com/marketplace/actions/close-issue)) 這個 GitHub Action，再搭配 `if` 條件判斷，來自動關掉一些 bot 所開的 issue。

<!-- more -->

```yaml
name: Close CommentBot Issues

on:
  issues:
    types: [opened]

jobs:
  closeIssue:
    runs-on: ubuntu-latest

    steps:
      - if: startsWith(github.event.issue.user.login, 'utterances-bot') == true
        name: Close Issue
        uses: peter-evans/close-issue@v1
```

# 相關資源

* [GitHub Action - Close Issue](https://github.com/marketplace/actions/close-issue)
