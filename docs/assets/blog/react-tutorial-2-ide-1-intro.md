---
title: "[React速成班]有錢沒錢，選個編輯器好過年(1)-介紹篇"
date: 2016-03-06 16:00:33
category: React速成班
tags:
    - React
    - IDE
    - Visual Studio
    - Visual Studio Code
    - Sublime
    - Atom
---

俗話說得好，**好的IDE帶你上天堂，壞的IDE讓你deat line delay住套房**。在寫todo list練習之前，先讓我用幾篇文章來介紹一下IDE的部分。React雖然熱門，但畢竟還算是比較新的東西，所以許多常見編輯器或IDE針對React的支援度都還是有限，最常見的問題就是把JSX程式碼存成.js檔時，由於一般都會在裡面插入類似HTML的JSX語法，結果就導致了大部分編輯器語法highlight出錯。不過畢竟React可是當今世上最熱門的library啊，當然許多主流的編輯器還是多少都有支援的。今天就在不要太貪心，只要求語法highlight不要出錯、不管是否有autocomplete、intellisense等其他酷炫功能的條件下，來比較幾款常見的程式編輯器。

<!-- more -->

# Visual Studio

如果說要無腦不做任何設定就可以開始編輯JSX的話，Visual Studio絕對是最佳選擇，只需要將.js附檔名改為.jsx即可正常顯示；Visual Studio Update 1還支援到可以直接用TypeScript來寫JSX，也可以用reference的方式做到支援intellisense，方法可以參考Bruce大大的「[如何為VISUAL STUDIO加上未支援的JAVASCRIPT框架INSTELLISENSE功能，以REACT為例](blog.kkbruce.net/2015/09/howto-add-not-support-javascript-instellisense.html#.Vtl-t_J96Uk)」，搭配Asp\.Net MVC的話還有[React.NET](http://reactjs.net/)可用，讓整個開發流程更加順暢！只能說Visual Studio果然不負地表上最強的編輯器之美名阿XD

不過缺點也很明顯就是Visual Studio永遠都是怪獸級的IDE，既強大又肥大，如果有一隻Asp.Net MVC專案需要用React的話，反正Visual Studio都打開了，用它來寫React當然是很好的選擇，但假如是像這系列文章，只是當作練習的話，光開始寫程式前開Visual Studio的時間就讓人受不了了吧...

# Visual Studio Code

[Visual Studio Code](https://www.visualstudio.com/zh-tw/products/code-vs.aspx) 是微軟基於[Electron](http://electron.atom.io/) 發展出來的輕量級編輯器(但功能一點都不輕量級)，也已經支援JSX的語法highlight了，一樣必須將.js檔改為.jsx才行，不過可以安裝"[jsx-is-js](https://marketplace.visualstudio.com/items?itemName=eg2.js-is-jsx)"擴充，讓.js檔也可以支援JSX語法。根據官方說法在之後的版本對JSX和React的highligh會更加完整。

# Atom

[Atom](https://atom.io/)是GitHub出品的程式碼編輯器，可以透過安裝[React套件](https://atom.io/packages/react)來支援JSX語法，但副檔名一樣必須要改為.jsx。

# Sublime Text 3

以目前來說，透過設定後支援度最完整的看起來應該就是[Sublime Text 3](https://www.sublimetext.com/3)，Sublime Text3本身就可指定附檔名要用何種方式進行highlight，只要安裝[Babel](https://packagecontrol.io/packages/Babel) 套件後，將.js跟.jsx都設定為用JavaScript(Babel)進行highlight，如此一來就可以同時支援.js跟.jsx了。Highlight的畫面目前看起來也是最舒服的(純粹個人感覺)。

# 總結

- 如果要無腦使用，或是前後端要同時進行，甚至是Asp\.Net MVC專案要以Reace當View的話，- Visual Studio 2015是不二選擇，但是電腦要夠力，也要有點耐心
- Visual Studio Code個人是覺得非常值得期待
- Atom不好不壞，沒有特別突出，但也算堪用
- Sublime Text 3目前看起來是最適合開發單純React的程式

上是個人整理編輯器的心得，未必完全是正確的，如果有什麼更推薦的編輯器，或介紹的編輯器有漏掉導致我錯誤評估了，也歡迎留言告訴我。之後在來介紹一下幾個編輯器開發React環境的設定吧。