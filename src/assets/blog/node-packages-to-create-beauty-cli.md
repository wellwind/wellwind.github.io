---
title: "[node.js] 打造美觀的互動式 CLI 介面"
date: 2022-03-06 20:00:33
category: "前端軍火庫"
tags:
---

前陣子在 Youtube 上看到了一部影片，介紹了好幾個 node.js 的套件，來幫助我們打造漂亮的 CLI，才後知後覺的發現一直在使用的 Angular CLI、Schematics 等等，許多由 node.js 開發的 CLI 工具，背後那些美觀的畫面都是基於這些套件，而不是自己刻的，所以整理了一下這些套件的介紹與示範！

{% asset_img 00.png %}

<!-- more -->

範例程式：https://github.com/wellwind/resume-builder-cli-demo

# 影片支援

<iframe width="560" height="315" src="https://www.youtube.com/embed/_oHByo8tiEY" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>

# chalk

[chalk](https://github.com/chalk/chalk) 套件可以讓我們輕易的輸出各種五顏六色的內容到畫面上，而不再只是死死的黑底白字，眼前立刻就亮了起來。

{% note warning %}

寫這篇文章時，chalk 是 5.0.0 版，而 TypeScript 是 4.6.0，目前會有不相容的問題，導致 chalk 新版不支援 TypeScript，因此若要使用 TypeScript 的話，目前需要安裝 `chalk@4.1.2`。

[相關 issue 參考](https://github.com/microsoft/TypeScript/issues/46452)

{% endnote %}

要印出有顏色的文字，只要使用 chalk 指定顏色即可：

```typescript
import chalk from 'chalk';

console.log(chalk.red('Hello World'));
```

如果要指定背景顏色，可以使用 `bg*` 系列的方法，

```typescript
console.log(chalk.bgRed('Hello World'));
```

當然，也可以同時指定文字顏色與背景顏色，可以先指定背景，再指定顏色；也可以反過來，先指定顏色，再指定背景。

```typescript
console.log(chalk.red.bgBlue('Hello World'));
console.log(chalk.bgBlue.red('Hello World'));
```

不論是文字顏色還是背景顏色，除了內建顏色外，也能夠自己指定色碼：

```typescript
console.log(chalk.bgHex('#DEADED')('Hello World'));
console.log(chalk.hex('#DEADED')('Hello World'));
```

另外，以可以設定底線：

```typescript
// 藍色底線文字
console.log(chalk.underline.blue('Hello World'));
```

也可以設定文字顏色和背景顏色反轉

```typescript
// 文字藍色+背景紅色 -> 反轉：文字紅色+背景藍色
console.log(chalk.bgRed.blue.inverse('Hello World'));
```

透過 chalk，就可以自由的輸出各種顏色的文字啦！

# gradient-string

chalk 只可以產出單一顏色，而 [gradient-string](https://github.com/bokub/gradient-string) 更酷，可以產生漸層的顏色。

我們可以直接使用內建的漸層顏色：

```typescript
import gradient from 'gradient-string';
console.log(gradient.rainbow('Hello World'));
```

{% asset_img 01.png %}

也可以自己定義漸層顏色：

```typescript
// Using varargs
let coolGradient = gradient('red', 'green', 'blue');

// Using array
let coolGradient = gradient(['#FF0000', '#00FF00', '#0000FF']);
```

如果產生的文字是多行文字，預設是從上到下逐行變色：

```typescript
console.log(gradient.mind('Line 1\nLine 2\nLine 3'));
```

{% asset_img 02.png %}

如果希望每一行都是從左到右逐漸變色，可以使用 `.multiline`：

```typescript
console.log(gradient.mind.multiline('Line 1\nLine 2\nLine 3'));
```

{% asset_img 03.png %}

# figlet.js

[figlet.js](https://github.com/patorjk/figlet.js) 可以把一段文字轉成圖片，當然，在 console 輸出的不是真的圖片，而是將一堆 ascii 文字組合起來，讓他看起來像原始指定的文字內容，例如：

{% asset_img 04.png %}

figlet.js 實作了 [FIGFonts](https://github.com/lukesampson/figlet/blob/master/figfont.txt)，這是一個規範文件，也是一種產生出這種圖形文字的規則，裡面說明了產生出這種文字的方法。

使用方式也很簡單，安裝後呼叫 `figlet` 即可，產生出來的結果會在 callback 方法內。

```typescript
figlet.text('Hello World', (error, result) => {
    console.log(result);
});
```

由於產生這種文字需要一時間運算，因此 `flglet.text` 是非同步執行的，如果想要同步執行，也可以使用 `figlet.textSync`

```typescript
var result = figlet.textSync('Hello World');
console.log(result);
```

搭配 chalk 或 gradient-string 套件，就成了許多 CLI 工具剛啟動時的 banner 畫面了！

{% note warning %}

當然，這只支援一般的 ASCII code 文字，並不支援中文。

{% endnote %}

# inquire.js

[Inquirer.js](https://github.com/SBoudrias/Inquirer.js) 可以幫助我們打造互動式的介面，提供了許多簡單的參數，來讓使用者輸入答案、選擇選項等等，藉由互動的方式協助使用者完成各種設定。

安裝完成後，可以使用 `inquirer.prompt()` 開始進行提問，基本架構：

```typescript
inquirer.prompt([
  // 題目
]).then(result => {
    // 回答內容
});

```

其中提供了很多的提目類型：

{% asset_ing 05.png %}

例如文字類型：

```typescript
inquirer.prompt([
  {
    type: 'input',
    name: 'Name',
    message: 'Your Name?'
  },
  {
      type: 'list',
    name:'sex',
    message: 'Your Sex?',
    choices: [
        'Male',
      'Female'
    ]
  }
]).then(result => {
    console.log(result);
});
```

{% asset_img 06.png %}

單選類型：(可以使用上下方向鍵選擇)

```typescript
inquirer.prompt([{
    type: 'list',
    name: 'sex',
    message: 'Your Sex?',
    choices: [
      { name: 'Male', value: 'M' },
      { name: 'Female', value: 'F' },
    ],
    default: 'M'
}])
```

{% asset_img 07.png %}

複選類型：(使用放下方向鍵切換選項，空白鍵選擇)

```typescript
inquirer.prompt([{
    type: 'checkbox',
    name: 'Interest',
    message: 'Your Interest (Multiple)',
    choices:[
        { name: 'Angular', value: 'angular' },
        { name: 'HTML', value: 'html' },
        { name: 'CSS', value: 'css' },
        { name: 'React', value: 'react' },
        { name: 'Vue', value: 'vue' },
    ]
}])
```

{% asset_img 08.png %}

更多選項可以到 GitHub 上參考。

inquirer.js 也可以搭配 RxJs 的 subject 使用，像我這麼愛熱 RxJS 的人，一定要特別提出來！

```typescript
inquirer.prompt(prompts).ui.process.subscribe(answers => {
    console.log(answers);
})

prompts.next({
  type: 'input',
  name: 'Name',
  message: 'Your Name?',
});

prompts.next({
  type: 'list',
  name: 'sex',
  message: 'Your Sex?',
  choices: [
    { name: 'Male', value: 'M' },
    { name: 'Female', value: 'F' },
  ],
  default: 'M',
});

prompts.complete();
```

{% asset_img 09.png %}

{% note info %}

所有顯示的文字，都可以透過 chalk 等套件改變顏色。

{% endnote %}

# nanospinner

nanospinner 可以建立一個 spinner 的小動畫，讓我們能「感覺」程式還在處理中。

建立一個 spinner，並呼叫 `start()`，就可以看到一個小動畫

```typescript
const spinner = nanospinner.createSpinner('Processing').start();
```

{% asset_img 10.png %}

完成後，呼叫 `success()` 即可，會提示成功的 icon

```typescript
spinner.success({ text: 'Done' });
```

{% asset_img 11.png %}

當然，如果發生錯誤，也可以呼叫 `error()`，會提示錯誤的 icon

```typescript
spinner.error({ text: 'Error' });
```

{% asset_img 12.png %}

{% note info %}

一樣的，所有顯示的文字，都可以透過 chalk 等套件改變顏色。

{% endnote %}

# 本日小結

第一次看到這麼花俏的介面，是剛接觸 Angular CLI 的時候，隨著 schematics 的發展，也出現了非常具有互動式的功能，後來又看到 Firebase CLI 工具，也都有類似的功能，原本以為都是這些 CLI 自己刻的，沒想到早就有相關的套件可以幫助我們達到一樣的目標了。對於要使用 node.js 實作一些小工具來說真的是非常方便啊！！
