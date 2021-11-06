---
title: "[GitHub Actions] 自動關閉某個 bot 的 issues"
date: 2021-11-01 15:02:02
category: "GitHub Actions Snippets"
tags:
  - "GitHub Actions"
---

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
