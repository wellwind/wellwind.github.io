---
title: "[React速成班]深入JSX(2)-使用技巧"
date: 2016-05-20 21:08:51
category: React速成班
tags:
    - React
    - JSX
---

在上一篇文章裡面我們已經針對JSX的原理和使用方法做了一些基本的說明，接下來就來談一些實際開發時的使用技巧吧！

<!-- more -->

# 在JSX中使用註解

HTML的註解是用 `<!-- comment -->` 格式，但這在JSX會無法進行編譯(還記得嗎？**JSX的本質還是JavaScript**)，因此我們可以使用**大括弧{}裡面塞入JavaScript註解**的方式來進行對JSX語法的註解

```javascript
          {/* 
            這是一段
            多行註解 
            */
            // 這是一段單行註解
            }
          <input type="text" name="todoText" value={this.state.todoText}
            onChange={this.handleAddTodoTyping}></input>
```

# 使用boolean attribute

在撰寫HTML時，若我們需要將一個button或radio設定為disable時，我們會設定`disabled="disabled"`，不過這樣表示既不直覺，在使用JavaScript時也不好撰寫，例如要控制一個按鈕是否可以點選我們可能會寫成這樣

```html
          <button
            onClick={this.handleAddTodo}
            disabled={this.state.todoText === "" ? "disabled" : ""}>Add</button>
```

不過其實JSX在編譯時，針對disabled="disabled"這種表達方式可以直接用`disabled={true}`的方式呈現，這樣在撰寫程式時可讀性就會比較好，因此上面的例子可以改寫成

```html
          <button
            onClick={this.handleAddTodo}
            disabled={this.state.todoText === ""}>Add</button>
```

另外當disabled單獨存在時，JSX編譯會視為`disabled={true}`

```javascript
// 以下兩種方式會將按鈕disable
var button1 = <input type="button" disabled />;
var button2 = <input type="button" disabled={true} />;

// 以下兩種方式不會將按鈕disable
var button3 = <input type="button" />;
var button4 = <input type="button" disabled={false} />;
```

# class與for屬性

還記得我們在「[從TodoList範例學習React(1)-基本架構](http://wellwind.idv.tw/blog/2016/03/13/react-tutorial-5-react-basic-and-todolist-scaffold/)」提過的嗎？class和for是HTML標準的屬性，但因為在JSX中會編譯成JavaScript的關係，偏偏class和for又是JavaScript的保留字，因此我們必須用**className和htmlFor**來取代它

```javascript
{ /* 使用className取代class */ }
<div className="foo" />
{ /* 使用htmlFor取代for */ }
<label forName="bar" />
```

# HTML內容放在變數裡面使用時

先看看以下程式碼

```javascript
var App = React.createClass({
  getInitialState: function(){
    // 模擬一開始先從server撈出
    var data = "<strong>&copy; Wellwind</strong>";
    return {commentText: data};
  },
  render: function(){
    return (
      <div>{this.state.commentText}</div>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById("content")
);
```

在這段程式碼中，我們在元件開始時先模擬從server撈出包含HTML的相關資料，然後在render時輸出，因此我們預期的結果應該是

{% note info %}

**© Wellwind**

{% endnote %}

 但實際上產生的結果卻是

{% note info %}

<strong>&copy; Wellwind</strong>

{% endnote %}

HTML原始碼被直接呈現了，這是考量到網頁程式很常見的XSS攻擊，因此將變數的內容都先轉換過後以原始資料的方式進行呈現，如果真的遇到需要呈現HTML效果時，可以改用以下方式：

```javascript
var App = React.createClass({
  getInitialState: function(){
    // 模擬一開始先從server撈出
    var data = "<strong>&copy; Wellwind</strong>";
    return {commentText: data};
  },
  render: function(){
    return (
      // <div>{this.state.commentText}</div>
      // 改用設定dangerouslySetInnerHTML的方式呈現HTML
      <div dangerouslySetInnerHTML={{__html: this.state.commentText}}></div>
    );
  }
});
```

# 自訂HTML屬性

當在撰寫JSX時，如果不是傳入標準HTML屬性，在編譯時會忽略這些屬性，這時候我們必須用data-*的方式來自訂屬性

```html
<div data-custom-attribute="foo" />
```

# 使用...來傳遞屬性資料

當我們要在元件之間傳遞參數時，我們應該很習慣用下面的方式進行傳遞

```javascript
var InnerApp = React.createClass({
  render: function(){
    return (
      <div>
        <div><strong>Foo: </strong>{this.props.foo}</div>
        <div><strong>Bar: </strong>{this.props.bar}</div>
      </div>
    );
  }
})

var App = React.createClass({
  render: function(){
    return (
      <InnerApp foo="test" bar="test2" />
    );
  }
});
```

不過當要傳遞的屬性很多，要一個一個將資料塞進去就會變得很不方便，這時候我們可以使用ES6語法提供的...來傳遞大量參數

```Javascript
var App = React.createClass({
  render: function(){
    var props = {
      foo: "test",
      bar: "test2"
    }
    return (
      <InnerApp {...props} />
    );
  }
});
```

這樣是不是就清爽多了呢！

### 參考資料：

https://facebook.github.io/react/docs/jsx-gotchas.html

https://facebook.github.io/react/tips/dangerously-set-inner-html.html

https://facebook.github.io/react/docs/jsx-spread.html

