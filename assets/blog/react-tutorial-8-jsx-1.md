---
title: "[React速成班]深入JSX(1)-基本篇"
date: 2016-04-10 20:59:12
category: React速成班
tags:
    - React
    - JSX
---

JSX與法是React中很特別的一個部分，它可以讓你用JavaScript產出HTML時用最直覺的方式去表達，也就是類似直接撰寫HTML的方式，大幅簡化產出元件的難度，今天我們就來比較深入的了解JSX！

<!-- more -->

# 不使用JSX的話...

JSX在React中並不是必要的，它只是用來簡化產出元件的方法，因此若我們不使用JSX的話，可以直接使用`React.createElement`，並代給他對應的參數內容，也可以用來產生元件。例如我們要產出一個h1 tag且class為head內容為test時，可以寫成：

```javascript
var H1WithoutJSX = React.createElement("h1", {className: "heading"}, "Test");

ReactDOM.render(
    H1WithoutJSX, 
    document.getElementById("content"));
```

在這邊我們用React.createElemnt建立一個物件並指派給`H1WithoutJSX`變數，再將這個變數代物ReactDOM.render中，來產生內容；React.createElement裡面主要有3個參數

1.  **標籤名稱**：像是h1, div, span等等
2.  **屬性內容**：也就是props的內容，在這個例子我們要產生class，但class是JavaScript的保留字，因此需使用className：由於props是以key-value形式存在的，所以我們必須以物件的方式傳入
3.  **標籤裡的內容(child)**：也就是HTML tag裡面的內容

當然我們也可以產生巢狀的資料，只要在child繼續使用React.createElement就好了，例如：

```javascript
var DivWithH1 = React.createElement(
    "div",
    null,
    React.createElement("h1", {className: "heading"}, "Test"));
ReactDOM.render(
    DivWithH1, 
    document.getElementById("content"));
```

這裡很明顯可以看到裡面產生h1的方式我們前面已經用過，所以也可以寫成這樣，用類似組合的方式完成：

```javascript
var H1WithoutJSX = React.createElement("h1", {className: "heading"}, "Test");
var DivWithH1 = React.createElement(
    "div",
    null,
    // React.createElement("h1", {className: "heading"}, "Test"));
    H1WithoutJSX); // 第三個參數改放前面宣告過的H1WithoutJSX
ReactDOM.render(
    DivWithH1, 
    document.getElementById("content"));
```

# 使用JSX

看到目前是否已經發現不使用JSX的問題了呢？雖然我們可以用React.createElemtnt方式來產生所需的元件，但它的**可讀性遠遠不及使用JSX語法**，尤其是需要巢狀表示時，而且到現在我都還提到如何處理props, states等問題！光是要產出元件就這麼麻煩了，如果使用這種方式開發，簡單的元件可能還好，複雜一點就會很可怕了！

也因此JSX就是用來解決這種麻煩問題的，JSX其實是類似HTML的XML語法，它最特別的地方是可以直接寫在JavaScript裡頭，然後再透過適當的編譯器，來幫助我們將JSX編譯成React.createElement的用法，這部份我們在「[Hello World範例](https://dotblogs.com.tw/wellwind/2016/03/04/react-tutorial-1)」中就已經提過了。因此上面的例子我們可以很簡單的寫成這樣：

```javascript
var NestedElementInJSX = 
    <div>
        <h1 className="heading">Test</h1>
    </div>;
ReactDOM.render(
    NestedElementInJSX, 
    document.getElementById("content"));
```

可讀性是不是立馬大大提升呢？

## JSX中使用JavaScript

透過編譯器幫助，我們不僅可以在JavaScript中撰寫JSX，也可以在JSX中撰寫JavaScript！只需要用**{大括弧}**將JavaScript包住即可，例如下面例子：

```javascript
var height = 183;
var weight = 80;
var BMI = 
    <div>
        <span>BMI is: {weight / Math.pow(height / 100, 2)}</span>
    </div>
ReactDOM.render(
    BMI, 
    document.getElementById("content"));
```

在這個例子裡面可以看到我們在JSX裡面用大括弧包住了一段JavaScript語法，這大括弧裡原則上你可以寫任何的JavaScript語法，包含使用其他第三方的library。

## 使用React.createClass

在剛剛的例子中我們的ReactDom.render中都是直接把變數帶進去，可是在之前文章的例子時我們都可以帶入JSX語法，要帶入JSX語法時，要這樣使用時，我們就必須要React.createClass來產生一個完整的元件，這個元件將會有完整的生命週期，以及可以使用props和state，這部分我們在之後的文章再來介紹。React.createClass裡面必須要**實作一個render方法，來回傳JSX語法內容**，在render方法中，我們可以想像成將需要的標籤組合起來成為一個新的元件，以上一個BMI的例子為例，我們可以寫成：

```javascript
var BMICompoment = React.createClass({
    render: function(){
        var height = 183;
        var weight = 80;
        return <div><span>BMI is: {weight / Math.pow(height / 100, 2)}</span></div>;
    }
})
ReactDOM.render(
    // BMI, // 直接使用JSX語法的話, 只能當作變數使用
    <BMICompoment />, // 透過React.createClass建立的元件就可以當成JSX語法的標籤使用, 而不再只是變數 
    document.getElementById("content"));
```

在React.createClass中我們回傳了一行JSX語法，但當需要回傳多行JSX時，就需要用**(括弧)**將JSX語法包起來：

```javascript
var BMICompoment = React.createClass({
    render: function(){
        var height = 183;
        var weight = 80;
        return ( // 多行JSX, 使用(括弧)包住
            <div>
                <span>BMI is: {weight / Math.pow(height / 100, 2)}</span>
            </div>
        );
    }
})
```

# 單元回顧

這篇文章主要釐清了之前的系列文章中對於某些語法使用上可能會搞不清楚為什麼要這樣寫的問題：

1.  在React的世界中我們必須使用`React.createElement`來產生標籤的內容，但用這種方式產生會造成很多的不方便，因此我們使用JSX語法來幫助我們用最直覺的方式來產生需要HTML標籤，再透過編譯器來進行轉換。
2.  React.createElement主要是用來產生HTML標籤的內容，要產生完整的元件則必須使用`React.createClass`來完成，透過實作render方法，我們可以**把JSX語法(或是React.createElement產生的變數)組裝起來**，成為一個新的元件來使用。
3.  React.createElement是非常核心重要的方法，但會造成可讀性不佳，因此我們用JSX語法取代掉，在實際開發時，我們會遇到**包含React.createClass、ReactDOM.render與JSX**

今天的文章就到這邊，希望可以幫助大家釐清JSX基本語法使用上的問題與原理，下一篇我們再來介紹一些使用JSX語法需要注意的部分吧！

### 番外篇

偷渡一下Visual Studio Code撰寫JSX時的畫面，可以看到對於使用React.createClass時的JSX語法高亮支援，看起來也是很舒服的！

{% asset_img react-8-1.png %}