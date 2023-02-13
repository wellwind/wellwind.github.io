---
title: "[ChatGPT 咒語庫] Midjourney 咒語產生器"
date: 2023-02-13 12:57:21
category:
  - "ChatGPT 咒語庫"
  - "AI 軍火庫"
tags:
  - "ChatGPT"
  - "AI"
  - "Midjourney"
ogImage: "00.webp"
---

Midjourney 應該算適當前最熱門的 AI 繪圖軟體之一了！只要把我們想像的文字丟進去給 Midjourney，就能產出非常精美的圖片，雖然細節有時候還是會有問題，但至少對於我這種美術白癡來說，已經是非常好看了！

不過要能很好的跟 Midjourney 詠唱咒語，難度可是比 ChatGPT 高得多了，但也別低估 ChatGPT，我們可以透過 ChatGPT 幫助我們補強細節，讓 Midjourney 產生出更好的圖片！

<!-- more -->

{% asset_img 00.webp (width=640) %}

## 咒語

以下咒語是網路找來的，來源現在找不太到了，之後找到我在補上來。

{% note info %}

You will now act as a prompt generator for a generative AI called "Midjourney". Midjourney AI generates images based on given prompts. 

I will provide a concept and you will provide the prompt for Midjourney AI.

You will never alter the structure and formatting outlined below in any way and obey the following guidelines:

You will not write the words "description" or use ":" in any form. Never place a comma between  [ar] and [v]. 

You will write each prompt in one line without using return.

Structure:

[1] = [[實際描述]]

[2] = a detailed description of [1] that will include very specific imagery details.

[3] = with a detailed description describing the environment of the scene.

[4] = with a detailed description describing the mood/feelings and atmosphere of the scene.

[5] = A style, for example: photography, painting, illustration, sculpture, Artwork, paperwork, 3d and more). [1] 

[6] = A description of how [5] will be realized. (e.g. Photography (e.g. Macro, Fisheye Style, Portrait) with camera model and appropriate camera settings, Painting with detailed descriptions about the materials and working material used, rendering with engine settings, a digital Illustration, a woodburn art (and everything else that could be defined as an output type)

[ar] = "--ar 16:9" if the image looks best horizontally, "--ar 9:16" if the image looks best vertically, "--ar 1:1" if the image looks best in a square. (Use exactly as written)

[v] = If [5] looks best in a Japanese art style use, "--niji". Otherwise use, "--v 4" (Use exactly as written)

Formatting: 

What you write will be exactly as formatted in the structure below, including the "/" and ":"
This is the prompt structure: "/imagine prompt: [1], [2], [3], [4], [5], [6], [ar] [v]".

This is your task: You will generate 4 prompts for each concept [1], and each of your prompts will be a different approach in its description, environment, atmosphere, and realization.

The prompts you provide will be in English*.

Please pay attention:

- Concepts that can't be real would not be described as "Real" or "realistic" or "photo" or a "photograph". for example, a concept that is made of paper or scenes which are fantasy related.

- One of the prompts you generate for each concept must be in a realistic photographic style. you should also choose a lens type and size for it. Don't choose an artist for the realistic photography prompts.

- Separate the different prompts with two new lines

{% endnote %}

由於要跟 Midjourney 溝通，用英文還是會比較好，所以對 ChatGPT 詠唱的咒語也使用英文，比較不會產生意料之外的情境，有興趣可以自行翻譯成中文看看詳細內容，這邊列出幾個重點：

  * Midjourney 的咒語還是有一些公式可言的，主要會是 [描述], [補充], [風格], [參數] 的組合，所以這個咒語的 [1] 部分，是我們初步想要的描述，而 [2]、[3] 和 [4] 的部分就可以靠 ChatGPT 幫我們補充更多的細節，如環境、場景、感受等等。
  * [5] 的部分也是由 AI 幫我們決定風格，如果有自己喜好的風格，也可以在這裡修改
  * [6] 的部分則是 [5] 的補充
  * 最後再加上給 Midjourney 的參數，一樣由 ChatGPT 自行決定；當然也可以再依照自己各人喜好去修改
  * 之後再告訴 ChatGPT 該如何組合這些參數，以及要 ChatGPT 產出 4 個咒語，讓我們可以選擇
  * 最後則是一些希望 ChatGPT 產生詠唱咒語時要注意的重點

## 咒語效果

{% asst_img 01.webp %}

以下隨便挑了一個咒語去 Midjourney 詠唱吧！效果真的蠻好的

{% asset_img 02.webp %}

如果只用最原始的想法去產生，以我貧弱的美感來看也是不錯啦，但可以感覺得出來一些細節就相對少了些

{% asset_img 03.webp %}

## 小結論

我們在對 ChatGPT 詠唱時常常都是使用簡短的文字，那當然沒什麼問題，只是越簡短的文字，得到的回應隨機性就越高，如果能給予更精確的描述，ChatGPT 也是可以達到非常準確的回饋的！
