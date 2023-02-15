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

Midjourney 應該算是當前最熱門的 AI 繪圖軟體之一了！只要把我們想像的文字丟進去給 Midjourney，就能產出非常精美的圖片，雖然細節有時候還是會有問題 (例如經典的手指頭...)，但至少對於我這種美術白癡來說，已經是非常好看了！

不過要能很好的跟 Midjourney 詠唱咒語，難度可是比 ChatGPT 高得多了，但也別低估 ChatGPT，我們可以透過 ChatGPT 幫助我們補強細節，讓 Midjourney 產生出更好的圖片！

<!-- more -->

另外，你也可以透過 [Midjourney 咒語解析器](https://fullstackladder.dev/blog/2023/02/13/chat-gpt-prompts-midjourney-analyzer/) 來幫助自己學習課種 Midjourney 咒語。

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

* [1] = [[實際描述]]
* [2] = a detailed description of [1] that will include very specific imagery details.
* [3] = with a detailed description describing the environment of the scene.
* [4] = with a detailed description describing the mood/feelings and atmosphere of the scene.
* [5] = A style, for example: photography, painting, illustration, sculpture, Artwork, paperwork, 3d and more). [1]
* [6] = A description of how [5] will be realized. (e.g. Photography (e.g. Macro, Fisheye Style, Portrait) with camera model and appropriate camera settings, Painting with detailed descriptions about the materials and working material used, rendering with engine settings, a digital Illustration, a woodburn art (and everything else that could be defined as an output type)
* [ar] = "--ar 16:9" if the image looks best horizontally, "--ar 9:16" if the image looks best vertically, "--ar 1:1" if the image looks best in a square. (Use exactly as written)
* [v] = If [5] looks best in a Japanese art style use, "--niji". Otherwise use, "--v 4" (Use exactly as written)

Formatting:

What you write will be exactly as formatted in the structure below, including the "/" and ":"
This is the prompt structure: "/imagine prompt: [1], [2], [3], [4], [5], [6], [ar] [v]".

This is your task: You will generate 4 prompts for each concept [1], and each of your prompts will be a different approach in its description, environment, atmosphere, and realization.

The prompts you provide will be in English*.

Please pay attention:

* Use affirmative sentences and avoid using negative sentences.
* Describe what you want clearly and avoid using abstract vocabulary.
* Avoid using overly detailed specifics and try to use singular nouns or specific numbers.
* Avoid using extended associative concepts and use more specific keywords.
* Concepts that can't be real would not be described as "Real" or "realistic" or "photo" or a "photograph". for example, a concept that is made of paper or scenes which are fantasy related.
* One of the prompts you generate for each concept must be in a realistic photographic style. you should also choose a lens type and size for it. Don't choose an artist for the realistic photography prompts.
* Separate the different prompts with two new lines
* [VERY IMPORTANT] Provide a Traditional Chinese translation for every prompt.

{% endnote %}

由於要跟 Midjourney 溝通，用英文還是會比較好，所以對 ChatGPT 詠唱的咒語也使用英文，比較不會產生意料之外的情境，有興趣可以自行翻譯成中文看看詳細內容，這邊列出幾個重點：

* Midjourney 的咒語還是有一些公式的，主要是 [描述], [補充], [風格], [參數] 組合，所以這個咒語的 [1] 部分，是我們初步想要的**描述**，而 [2]、[3] 和 [4] 的部分就可以靠 ChatGPT 幫我們補充更多的細節，如環境、場景、感受等等。
* [5] 和 [6] 的部分也是由 AI 幫我們決定風格，如果有自己喜好的風格，也可以在這裡修改
* 最後再加上給 Midjourney 的參數，一樣由 ChatGPT 自行決定；當然也可以再依照自己各人喜好去修改
* 之後再告訴 ChatGPT 該如何組合這些參數，以及要 ChatGPT 產出 4 個咒語，讓我們可以選擇
* 最後則是一些希望 ChatGPT 產生詠唱咒語時要注意的重點，這邊特別請 ChatGPT 再用中文翻譯一下咒語，方便我們後續閱讀每個咒語的內容

補充一下，Please pay attention 的前面四點，是我參考 [Midjourney 如何讓畫面精準呈現](https://blog.akanelee.me/2023/01/26/ai-midjouyney-tutorial-writing-prompts/)，把文章內容丟到 ChatGPT，請 ChatGPT 幫我總結成重點清單，然後再翻譯成英文的結果，用 ChatGPT 濃縮重點也是很方便的！

{% asset_img 04.webp %}

## 咒語效果

{% asset_img 01.webp %}

以下隨便挑了一個咒語去 Midjourney 詠唱吧！效果真的蠻好的

{% asset_img 02.webp %}

如果只用最原始的想法去產生，以我貧弱的美感來看也是不錯啦，但可以感覺得出來一些細節就相對少了些

{% asset_img 03.webp %}

## 小結論

我們在對 ChatGPT 詠唱時常常都是使用簡短的文字，那當然沒什麼問題，只是越簡短的文字，得到的回應隨機性就越高，如果能給予更精確的描述，ChatGPT 也是可以達到非常準確的回饋的！
