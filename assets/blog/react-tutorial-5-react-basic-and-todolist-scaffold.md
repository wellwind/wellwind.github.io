---
title: "[React速成班]從TodoList範例學習React(1)-基本架構"
date: 2016-03-13 16:33:29
category: React速成班
tags:
    - React
---

接下來終於要開始透過從實做一個TodoList來學習React啦！本篇文章將會先對React的特色簡單做一些基本且必要的介紹，然後先框好我們的TodoList基本的內容，之後在後續文章一個一個去完成它。

<!-- more -->

# React在前端的角色

跟AngularJS這類的前端MVC框架比起來，React的作用主要是**扮演View的角色**，根據[官方的說法](https://facebook.github.io/react/docs/why-react.html)，React所要解決的問題只有一個：**建立大型應用程式且資料需要不斷變動時的管理問題**。

只要有一定程式經驗的人都知道，當程式越來越龐大時，模組化就是必然的方向，藉由模組化我們可以一次只關注在一個地方而不被其他部分干擾；而React也是一樣的用了概念，在React的世界中，我們所要做的事情就是把程式切成一個一個可重複使用的元件(components)，然後再將這些元件組合成系統，當資料產生變更時，React的Virtual DOM會幫我們重新整理View的內容，而Virtual DOM因為不會直接更新到DOM，而是會經過比較只需要更動的地方，再去更新實際的DOM，所以速度會比較快。

藉由React元件化的特色，我們可以將畫面切割封裝成一個一個可重用的積木，這些積木只關注在它自己應該要做的事情，因此不論是在測試或是維護都會更加容易。

{% note info %}
如果你已經熟悉AngularJS的話，應該會感覺React的compoments很類似AngularJs的directive。基本上概念是一樣的但是AngularJS並沒有強要求你一定要使用directive，事實上若對AngularJS沒有一定熟悉度或是應用層面不大時大部分情況也會不太想使用directive；而React則是基本規則就是要你打造一個個的元件，且在React中打造元件所需要學的東西比起AngularJS的directive簡單的多了。 
{% endnote %}

如果上面一大段文字很難消化的話，只需要記得一件事情：**「在React的世界中，我們要做的事情只要`將畫面切割成各種元件`，將元件獨立完成後再組裝」**。 

# 產生我們的第一個元件

先用我們之前HelloWorld的例子來看吧，當時的JavaScript內容如下：

```javascript
ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById("example")
);
```

其中`<h1>Hello, world!</h1>`對ReactDOM.render來說就是一個要產生的元件，但裡面的HTML(事實上是JSX)已經透露了實作的細節，這樣就會失去關注點分離的目標，因此我們希望將這段程式封裝起來，所以將程式碼改寫成這樣：

```javascript
ReactDOM.render(
  <HelloWorld />,
  document.getElementById("example")
);
```

這時候我們在看程式碼時就只需要知道**有一個HelloWorld的元件**即可，至於它到底做了什麼事情...我們只在出問題的時候去關注就好XD

那麼HelloWorld的元件到底要怎麼產生呢？我們可以用`React.createClass()`方法來產生一個元件，程式碼如下：

```javascript
var HelloWorld = React.createClass({
    render: function() {
        return (
            <h1>Hello, world!</h1>
        );
    }
});
```

在這段程式碼中我們宣告了一個HelloWorld的變數，內容是由React.createClass()產生的，在裡面我們建立了一個render方法，將HelloWorld的畫面實作內容傳回去，而HelloWorld這個變數就是一個React世界中的元件，當HelloWorld宣告完成後，在任何看得到HelloWorld的範圍內都可以重複使用這個元件。

有一點要特別注意的是，當return JSX語法時，請務必用括弧將JSX語法包起來。

接著我們可以透過前面介紹的babel編譯器來看看編譯後的JavaScript內容

```javascript
var HelloWorld = React.createClass({
  displayName: "HelloWorld",

  render: function () {
    return React.createElement(
      "h1",
      null,
      "Hello, world!"
    );
  }
});

ReactDOM.render(React.createElement(HelloWorld, null), document.getElementById("content"));
```

這樣就比較好理解了吧？我們透過`React.creatElement()`來產生HelloWorld元件的畫面實作(透過HelloWorld中的render方法)，再透過`ReactDOM.render()`來將它放到畫面上去！而HelloWorld裡面本身也是透過React.creatElement來產生對應的畫面實作。

如果還是不理解，也沒關係，因為也可能是我的解釋功力太差XD，反正我們只需要知道**在React的世界中，就是由一堆元件組合起來的就好了！**透過練習多寫幾次，就會越來越理解React巧妙的地方。

最後關於React的元件還有兩件事情要說明：

(1) 由於JSX語法本身會轉成JavaScript，而html語法的class和for屬性剛好在JavaScript是保留字，因此當我們的JSX寫成這樣：

```html
<label class="someClass" for="someElement">Label Text</label>
```

實際上在產出HTML時只會得到：

```html
<label>Label Text</label>
```

而不會得到class與for屬性，因此我們必須用**className**及**htmlFor**屬性來取代，變成這樣：

```html
<label className="someClass" htmlFor="someElement">Label Text</label>
```

(2) 在元件render中的JSX實作中，只允許回傳一個根節點，因此如果寫成這樣會是錯的：

```javascript
    render: function() {
        return (
            <h1>Hello, world!</h1>
            <h2>Hello world! Too</h2>
        );
    }
```

如果有多個節點時可以用span或div將這些節點都包起來成為一個跟節點

```javascript
    render: function() {
        return (
            <div className="header">
                <h1>Hello, world!</h1>
                <h2>Hello world! Too</h2>
            </div>
        );
    }
```

# 實際框出TodoList所需的元件

囉嗦鋪陳了一大堆，有了基本的概念之後，我們再用元件化的方式來思考看看一個TodoList需要做些什麼事情，我們先簡單大致分析一下需要以下元件：

1. **TodoItems**：顯示TodoList所有的項目
2. **AddTodoForm**：用來增加TodoItem的表單
3. **TodoList**：主要的容器，用來放置(組裝)TodoItems以及AddTodoForm，子元件的一些處理細節也會交由TodoList容器來管理

有了基本的架構規劃後，我們大致可以寫出這樣的程式碼雛形：

## TodoItems元件

```javascript
var TodoItems = React.createClass({
  render: function() {
    return (
      <div>我是TodoItems</div>
    );
  }
});
```

## AddTodoForm元件

```javascript
var AddTodoForm = React.createClass({
  render: function(){
    return (
      <div>我用來增加TodoItem</div>
    );
  }
});
```

## TodoList元件

```javascript
var TodoList = React.createClass({
  render: function(){
    return(
      <div className="todoList">
        <h1>我是一個TodoList容器</h1>
        <h2>我組合了TodoItems以及AddTodoForm兩個元件</h2>
        <TodoItems />
        <AddTodoForm />
      </div>
    );
  }
});
```

## 真正用來顯示TodoList的程式碼

```javascript
ReactDOM.render(
  <TodoList />,
  document.getElementById("content")
);
```

## 全部組裝在一起

我們可以將這些程式碼都放在同一個檔案中，當然也可以分開成不同檔案由不同的人來維護程式；最後HTML的程式碼如下：

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <title>ToDo List</title>
  <script src="build/react.js"></script>
  <script src="build/react-dom.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.23/browser.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.5/marked.min.js"></script>
</head>

<body>
  <div id="content"></div>
  <script type="text/babel" src="src/todo_list.jsx"></script>
</body>

</html>
```

這時候打開瀏覽器就可以看到這樣的畫面：

{% asset_img 001.png %}

之後的文章我們就可以開始將這些元件一個一個的實作出來啦！

# 單元回顧

在本篇文章中我們了解到在React的世界中一切都是由元件組成的，而我們的任務就是將元件一個一個打造出來後進行組裝。在目前的TodoList範例中，我們已經先將一個TodoList所需的元件雛型架構出來，接下來我們只需要將元件一個一個完成，即可完成一個TodoList囉。