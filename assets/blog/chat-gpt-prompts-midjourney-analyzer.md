---
title: "[ChatGPT 咒語庫] Midjourney 咒語解析器"
date: 2023-02-13 13:36:21
category:
  - "ChatGPT 咒語庫"
  - "AI 軍火庫"
tags:
  - "ChatGPT"
  - "AI"
  - "Midjourney"
ogImage: "00.webp"
---

前一篇文章我們提到可以[透過 ChatGPT 產生 Midjourney 咒語](https://fullstackladder.dev/blog/2023/02/13/chat-gpt-prompts-midjourney-generator/)，這讓我想到：「一直看人家的咒語來學習的效率可能有點低，是否能讓 ChatGPT 先幫我分析出幾個重要部分呢？」

經過一些嘗試與調整，今天就來分享一下我用 ChatGPT 來分析與學習 Midjourney 咒語的咒語 🤔

<!-- more -->

## 咒語

{% asset_img 00.webp (width=640) %}

我的咒語原型是這樣的：

{% note info %}

請你扮演一個 Midjourney 分析專家，並從現在開始，以繁體中文進行溝通。

我將提供一段用於 Midjourney 生成圖片的[提示]，提示是由一系列的[說明]使用 "," 組合而成的，請幫我依照以下方向分析其中的內容

* [1] 整張圖片的主要概念描述；說明[提示]中有哪些[說明]屬於這個方向
* [2] 對概念描述的補充說明，如情緒、視角、光影和觀點等；說明[提示]中有哪些[說明]屬於這個方向
* [3] 對圖片背景的描述，一樣包含基本概念與補充說明，；說明[提示]中有哪些[說明]屬於這個方向；如果沒有對背景特別描述，直接回答「無」
* [4] 圖片的參考風格，例如使用哪個時代、畫家、軟體、動畫、遊戲等為主要風格來產生；說明[提示]中有哪些[說明]屬於這個方向
* [5] 圖片的其他參數說明，所有 --xxx 類型的都是產生參數，請說明參數的用途
* [6] 列出所有的 [說明]

以下是我要請你分析的 Midjourney 提示，請依照以上要求進行分析

[[Midjourney 咒語]]

{% endnote %}

在這裡我先教 ChatGPT 所謂的 「咒語」應該是什麼格式，接著請 ChatGPT 將咒語內的每個 [說明] 部分進行分析，並依照我的需求分類，尤其是 [4] 的部分，可以幫助我快速分析出原始咒語到底用了什麼樣的風格作畫，之後就可以更快速的將一些喜歡的風格帶入我的創作中。

不過經過幾次測試調整後，有時靈由時不靈，尤其是 [說明] 部分常常被轉換成中文，最後妥協，把整段內容轉換成英文，就比較穩定了！

當然，是請 ChatGPT 翻譯後再調整的，但是大架構不變。

{% note info %}

Please ignore all previous instructions. From now on, communicate only in English.

I will provide a set of instructions, called a [prompt], for generating images in Midjourney. The [prompt] consists of a series of short [explanation] separated by commas. Please help me analyze the content of the [prompt] by answering the following questions in English:

* [1] What is the main concept of the image? Which [explanation] in the [prompt] relate to this concept?
* [2] Are there any additional details to the main concept, such as emotions, perspectives, light, shadow, or viewpoints? Which [explanation] in the [prompt] relate to these details?
* [3] Is there a background to the image? What are the basic concepts and any supplementary information related to it? Which [explanation] in the [prompt] relate to the background? If there is no specific background information, answer "none."
* [4] What is the reference style of the image? Is it inspired by a particular era, painter, software, animation, game, or other style? Which [explanation] in the [prompt] relate to the reference style?
* [5] Are there any other parameters for generating the image? Any parameters beginning with "--xxx" are relevant, so please explain their purpose.
* [6] List all of the explanations in the [prompt].

Please analyze the following [prompt] for generating images in Midjourney with English according to the above questions.

[[Midjourney 咒語]]

{% endnote %}

## 咒語效果

先看看使用中文的咒語，會得到什麼結果：

{% asset_img 01.webp %}

其實也很有幫助了，但我還是希望可以保留原始咒語的說明部分，麻煩的是 ChatGPT 經常會直接幫我翻譯成中文。所以後來我就都用英文了，效果會比較好：

{% asset_img 02.webp %}

這個咒語算是中英文交替用可以學習到更多的一個例子！

## 補充

2022/02/15：

後來我經過一些調整，總算是比較穩定可以對照原始的英文咒語了，我調整的是 [6] 的說明

* [6] 列出所有的 [說明]**，並保持原始的英文內容**

因為是個學習歷程，就不直接修改文章內容了，而是放在文章後面當做補充，只要願意多花點時間跟 AI 溝通，AI 也會很樂意的跟你溝通，這是一個很有趣的過程。
