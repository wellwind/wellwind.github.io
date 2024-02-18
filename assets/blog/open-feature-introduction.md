---
title: "[OpenFeature] 簡介"
date: 2024-02-18 18:43:18
category: "OpenFeature"
tags:
  - "OpenFeature"
  - "Feature Toggle"
  - "Feature Flag"
---

OpenFeature 是 2023-11-21 剛從 CNCF 基金會孵化出來的一個項目，目的是用更加標準化的方式來實現功能的開關。今天這篇文章簡單來介紹一下 OpenFeature 的基本概念。

<!-- more -->

## OpenFeature 是什麼？

OpenFeature 是一個功能開關的標準，它定義了一個功能開關的基本結構，以及功能開關的生命週期。OpenFeature 本身並不提供功能開關的實現，而是提供了一個標準化的介面，讓開發者可以更加方便的實現功能開關。

在過去，功能開關的實現方式各種各樣，有的是通過配置文件，有的是通過環境變量，有的是通過資料庫，有的是通過一些第三方服務等等。這些實現方式雖然各有優缺點，但是都缺乏標準化的介面，這就導致了功能開關的實現方式五花八門，不利於開發者的開發和維護。

<img src="https://openfeature.dev/assets/images/ff-service-9bfd5d029bfcd0ebbea6c6cab79b6a14.png" alt="open-feature-past" />

圖片來源：[https://openfeature.dev/docs/reference/intro](https://openfeature.dev/docs/reference/intro)

而 OpenFeature 則是定義了一個標準化的介面，讓開發者可以更加方便的實現功能開關。開發者只需要實現 OpenFeature 定義的介面，就可以將功能開關的實現標準化，這樣就可以更加方便的進行功能開關的開發和維護。

<img src="https://openfeature.dev/assets/images/of-architecture-a49b167df4037d936bd6623907d84de1.png" alt="open-feature-architecture" />

圖片來源：[https://openfeature.dev/docs/reference/intro](https://openfeature.dev/docs/reference/intro)

有了通用的介面，我們就能輕易地整合各種現有的 Feature Toggle 服務，如 LaunchDarkly、Split、Unleash、ConfigCat 等等的 Flag Management System。這樣就可以更加方便的使用這些服務，而不需要擔心它們的實現方式。

同時，OpenFeature 也有團隊自行維護的 SDK，整合了這些常見的 Feature Toggle 服務，讓開發者可以更加方便的使用這些服務。

當然，不透過這些服務的話，OpenFeature 在[規範](https://openfeature.dev/specification/appendix-a/#in-memory-provider)中也有說明如果要提供特定語言的 SDK，一定要有 In Memory 版本的實作，如此一來我們就能輕易不依靠任合其他 API 或資料庫等服務，只靠專案程式內的組態設定即可輕易完成 Feature Toggle 的功能。

## OpenFeature 組成角色

OpenFeature 主要由以下幾個組成角色：

- `Evaluation API`：用於評估功能開關是否開啟的介面。
- `Evaluation Context`：一個包含任意上下文數據的容器，可用作動態評估的基礎。
- `Provider`：用來與服務提供者整合的轉譯層 (translation layer)，負責將服務提供者的功能開關轉換成 OpenFeature 的介面。
- `Hooks`：在評估過程的生命週期，Hooks 可以讓我們更容易擴充 OpenFeature SDK
- `Events`：當狀態變更時提供的一些事件。

大多數情況，我們只需要知道 `Evaluation API`、 `Evaluation Context` 和 `Provider` 這三個角色即可，除非我們要整合自己的其他服務或是擴充 OpenFeature SDK 的功能。

## 小結

OpenFeature 是一個功能開關的標準，它定義了一個功能開關的基本結構，以及功能開關的生命週期。OpenFeature 本身並不提供功能開關的實現，而是提供了一個標準化的介面，讓開發者可以更加方便的實現功能開關。

下一篇文章我們在實際透過 JavaScript SDK 來使用 OpenFeature，感受一下 OpenFeature 的與彈性！
