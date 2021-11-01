---
title: "[GitHubActions] 發送 Telegram 訊息"
date: 2021/11/01 16:27:00
category: "GitHub Actions Snippets"
tags:
  - "GitHub Actions"
---

<!-- more -->

# 申請 Telegram Token

* 跟 [@BotFater](https://t.me/BotFather) 私訊取得 token
* 輸入 `/newbot` 並依照提示輸入資料，最終取得 token

# 取得 Chat Id

* 網址輸入 `https://api.telegram.org/bot{{ token }}/getUpdates`，可以得到聊天訊息的 chat id
* Char Id 為 `result[0].message.chat.id`
* 如果沒有資料，先隨意傳個訊息給建立好的 bot，就可以看到訊息更新了

# GitHub Action 發送 Telegram 訊息

以下 sample 為當 issue 有 comments 時發送 telegram 訊息

```yaml
# This is a basic workflow to help you get started with Actions

name: CI

# Controls when the workflow will run
on:
  issue_comment:
    types: [ created ]

jobs:
  sendMessage:
    runs-on: ubuntu-latest

    steps:
      - name: send telegram message on comment opened
        uses: appleboy/telegram-action@master
        with:
          to: ${{ secrets.TELEGRAM_CHAT_ID }}
          token: ${{ secrets.TELEGRAM_TOKEN }}
          message: |
            From: ${{ github.event.sender.login }}
            Title: ${{ github.event.issue.title }}
            Link: ${{ github.event.comment.html_url }}
            Body:
            ${{ github.event.comment.body }}
```

# 相關資源

* [GitHub Action - Telegram Message Notify](https://github.com/marketplace/actions/telegram-message-notify)
* [[Telegram] Telegram(五) 取得 Chat ID](http://blog.3dgowl.com/telegram-telegram%E4%BA%94-%E5%8F%96%E5%BE%97-chat-id/)
