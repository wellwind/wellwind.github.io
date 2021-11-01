---
title: "[TensorFlow.js] 前端也能玩Machine Learning：TensorFlow.js初體驗"
date: 2018-04-07 15:10:04
category: Machine Learning 機器學習
tags:
  - TensorFlow
  - TensorFlow.js
  - Machine Learning
  - 機器學習
---

[TensorFlow.js](https://js.tensorflow.org/)是Google將機器學習(Machine Learning、ML)框架TensorFlow的JavaScript版本，透過TensorFlow.js，讓JavaScript開發人員也有機會加入機器學習的領域。加上前端領域的生態圈支持，讓機器學習在瀏覽器上有了更多發揮的空間！例如結合攝影機、行動裝置的陀螺儀等等，只要裝置與瀏覽器支援，都能夠發會更多不同的變化，同時藉由在客戶端瀏覽器上執行的優勢，節省後端訓練的成本。

今天我們就來簡單介紹一下TensorFlow.js，以及簡單的機器學習訓練方式吧！

<!-- more -->

{% asset_img logo.png %}

# 關於 TensorFlow.js 的基礎知識

這是一篇很基礎很間單的TensorFlow.js介紹與範例，因此我們還是先簡單的介紹一下 TensorFlow.js。

## TensorFlow.js的特色與基本組成

由於TensorFlow.js是由JavaScript撰寫而成，因此只要與瀏覽器相關的應用，都可以與TensorFlow.js直接整合，這意味著我們可以將瀏覽器功能與機器學習搭配起來，組合成更多元的web application。

TensorFlow.js也支援WebGL，因此即使在瀏覽器上，我們也能使用GPU來加快運算結果，不用擔心在瀏覽器上的效能限制。

TensorFlow.js分成低階與高階兩組API。

低階的API是由[deeplearn.js](https://deeplearnjs.org/)衍生，負責處理一些低階如線性代數的資料運算等等，來協助我們處理機器學習中的數學運算部分。

而高階的API則是用來包裝一些常用的機器學習演算法，同時允許我們載入訓練好的模型，像是由Keras訓練的模型等等。

## TensorFlow.js的限制

目前TensorFlow.js不支援Node.js開發，因此我們只能在瀏覽器上使用，未來會支援Node.js，但時程未定。

# 開始使用 TensorFlow.js

## 直接使用CDN

接下來我們就可以開始使用TensorFlow.js啦！由於TensorFlow.js目前只能在瀏覽器上執行，為了簡化前置準備，我們直接建立一個index.html，並加入TensorFlow.js的CDN，如下：

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <title>TensorFlow.js DEMO</title>
</head>

<body>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest"></script>
    <script src="index.js"></script>
</body>

</html>
```

之後我們就能在index.js中開始使用TensorFlow.js進行機器學習啦！

## 使用 npm 或 yarn

當然，身為熟練的前端工程師，我們也能使用`npm`或`yarn`來安裝，如下：

```bash
npm install @tensorflow/tfjs
```

之後再用import的方式加入TensorFlow即可

```javascript
import * as tf from '@tensorflow/tfjs';
```

當然，你就需要使用babel或webpack等工具來轉換程式囉。

## 機器學習基本概念

先來簡單講講一般機器學習是怎麼做的，在機器學習中，通常我們會針對一個**題目**，給予一組**訓練資料**清單，這些資料包含了問題與答案，接著透過機器學習的各種演算法，來訓練出一個針對這個題目的**模型**。

這個模型通常就代表了一個**公式**，只要將題目帶進去公式，就能夠算出答案，而這個公式怎麼來的呢？就是透過機器學習演算法，這些演算法通常會先隨機產生一個公式(也就是模型)，接著將訓練資料帶進去計算出**預測值**，並與正確答案比較，並透過不斷的調整模型內容，不斷想辦法**降低預測值與正確答案的差距**，直到預測值與足夠接近正確答案為止。

簡單來說，就是經驗法則啦！剛開始學一項知識的時候，得到的結果會與預期落差很大，藉由不斷學到正確知識後，就會與預期越來越接近！

有了這樣的基本概念後，就讓我們來訓練一個簡單的模型吧！

另外，有時間的話建議可以先看過[Core Concepts in TensorFlow.js](https://js.tensorflow.org/tutorials/core-concepts.html)，對於TensorFlow.js的低階API有基礎的認知，會比較好理解後續的程式。(或是有機會再來簡單介紹一個TensorFlow.js的低階API)

## 產生第一個待訓練模型

首先我們先看一個簡單的數學公式代表我們的正確模型。

```
y = 2x
```

`x` 代表輸入值，`y`代表輸出結果，`2`是這個模型的重點參數，也是我們在訓練過程中期望達到的目標！

但目前我們還沒有任何模型可用，因此我們先在程式中加入一個全域變數，把它當做要被訓練的**模型參數**

```javascript
// 要被訓練的參數，這個參數隨著訓練次數增加會越來越準確
const trainingAnswer = tf.variable(tf.scalar(Math.random()));
```

上述程式中，`tf`是載入CDN程式後，用來放置TensorFlow.js相關程式的全域變數。

我們透過`tf.scalar()`將`Math.random()`的隨機值當作TensorFlow的數值資料，再使用`tf.variable()`將這個數值當作是一個變數，因此上面程式我們可以解讀為：**在TensorFlow中宣告一個變數，並給予一個隨機數值**。

接下來，我們再來以這個參數來產生一個**模型公式**

```javascript
function predict(x) {
    return tf.tidy(() => {
        return trainingAnswer.mul(x)
    });
}
```

`tf.tidy()`是用來避免變數在TensorFlow運算中站用過多記憶體的一種管理機制，在這裡我們不用想太多，大部分情境下，關於運算的都放在`tf.tidy()`中就對了，剩下的TensorFlow.js會幫我們處理！

`.mul()`，則是TensorFlow.js低階運算API的一種，主要用來進行乘法運算。

透過這個`predict()`函式，我們能運算出目前模式產生出來的預測值

## 定義損失函式(Loss Function)

損失函式是用來評估預測值與正確地案的差距，在訓練過程中，這個損失函式的輸出應該會越來越小，在這邊我們使用[Mean Square Error](https://developers.google.com/machine-learning/crash-course/glossary#MSE)函式作為評估的公式，代表的是預測結果與訓練資料中**所有答案平方差的平均**：

```javascript
function loss(predictions, labels) {
    const meanSquareError = predictions.sub(labels).square().mean();
    return meanSquareError;
}
```

## 定義訓練函式

接下來我們要定義訓練的方法，TensorFlow.js中提供了幾種訓練的演算法，我們選擇使用[Stochastic Gradient Descent](https://developers.google.com/machine-learning/crash-course/glossary#SGD)(SGD)演算法，這種演算法會根據訓練結果來隨機調升或調降參數的值，另外我們也需要設定一個學習率(learning rate)，這代表學習的跳耀程度，數值越低代表學習速度越慢，越高代表學習速度越快，但也可能會造成太過跳耀式的學習，導致學習成果走鐘

```Javascript
function train(xs, ys, numIterations) {
    const learningRate = 0.5;
    const optimizer = tf.train.sgd(0.5);

    for (let iter = 0; iter < numIterations; iter++) {
        optimizer.minimize(() => {
            const predsYs = predict(xs);
            return loss(predsYs, ys);
        });
    }
}
```

參數`xs`代表訓練用問題資料集，`ys`代表答案資料集，`numIterations`代表訓練次數，理論上訓練次數越多，就越接近結果，當然也越花時間，同時在學習率太高的情況下，訓練走鐘的機率也會增加。

`tf.train.sgd(0.5)`代表使用SGD訓練演算法，並以`0.5`的學習率進行訓練。

最後看到`optimizer.minimize()`方法，來調整參數，方法的callback中，我們將透過損失函式算出誤差值並回傳，`minimize()`方法會自動幫助我們調整損失函式中關聯到的參數，並透過調整參數把誤差值降到最低。

## 執行訓練

有了損失函式與訓練函式後，我們就可以將這些內容組合起來執行訓練啦！

```javascript
async function learnCoefficients(dataCount, iterations) {
    const correctAnswer = 2; // 正確答案
    const trainingData = generateData(dataCount, 2);

    console.log('Before Training: ', await trainingAnswer.data());

    // Train the model!
    await train(trainingData.xs, trainingData.ys, iterations);

    // 印出訓練結果
    console.log('After TRaining: ', await trainingAnswer.data());
}

learnCoefficients(100, 1000);
```

前兩行是利用正確的模型產生訓練資料，現實中則可能是準備好文字檔並讀取進來`generateData`內容如下：

```javascript
function generateData(numPoints, answer) {
    return tf.tidy(() => {
        // 產生常態分佈的隨機資料
        const xs = tf.randomNormal([numPoints], -1, 1);
        // 套用正確模型產生答案
        const ans = tf.scalar(answer);
        const ys = ans.mul(xs);
        // 回傳訓練資料與答案
        return {
            xs,
            ys
        };
    })
}
```

接著透過訓練函式，把問題、答案和訓練次數傳進去，讓訓練函式去把結果訓練出來，就可以得到一個正確的模型啦！

我們可以試著打開瀏覽器的console看一下執行結果：

{% asset_img result.png %}

訓練的結果就與我們的正確答案十分接近啦！

前端人員要進入機器學習領域，門檻又降低不少了呢！

# 本日小結

今天我們介紹了TensorFlow.js這關機器學習的架構，並且做了一個簡單的訓練程式，透過機器學習幫助我們解決一個數學問題。

透過TensorFlow.js，前端JavaScript開發人員可以在不需要了解其他程式語言的前提下，進入機器學習的領域，當然啦，我們還是要有機器學習相關的知識，才能夠正確的使用TensorFlow.js；同時也能搭配各種前端應用，組合出各式各樣的有趣應用，TensorFlow.js上也有一些結合web產生的DEMO程式，有興趣的話也可以上去玩玩看。

希望這篇文章可以幫助對於機器學習有興趣的前端朋友更容易入門，之後有機會的話，再來寫TensorFlow.js與神經網路等等的相關應用吧！

今天的程式碼在這裡：https://github.com/wellwind/tensorflow-js-practice

# 相關資源

-   [TensorFlow.js](https://js.tensorflow.org/)
-   [Core Concepts in TensorFlow.js](https://js.tensorflow.org/tutorials/core-concepts.html)
-   [Training First Steps: Fitting a Curve to Synthetic Data](https://js.tensorflow.org/tutorials/fit-curve.html)
