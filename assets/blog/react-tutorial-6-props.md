---
title: "[React速成班]從TodoList範例學習React(2)-透過實作TodoItems學習props"
date: 2016-03-18 16:44:21
category: "React速成班"
tags:
    - React
    - props
---

上一篇文章中，我們學到了在React的世界中，一切都是由元件組成的，也在基於這樣概念中把TodoList基本上需要的元件框出來，接下來在這篇文章中我們將實作TodoItems的部分，順便學習React中元件與元件資料傳遞的方法。

<!-- more -->

除非我們做的都是純靜態的頁面，否則在前端處理資料一定會是一個重要的議題，在React中，對於資料的處理或傳遞有兩個主要的屬性：props和state。而props就是用來作為元件與元件之間傳遞資料的媒介。

# 關於props

props主要用來在元件與元件之前傳遞資料，例如我們希望在TodoList元件中，將要顯示的資料傳給TodoItems元件，那麼我們可以將原本TodoList元件中的render方法內容寫成這樣：

```javascript
var TodoList = React.createClass({
    render: function() {
        var todoItems = [
                { id: 1, data: "Item 1" },
                { id: 2, data: "Item 2" }];
        return (
            <div className="todoList">
                <h1>我是一個TodoList容器</h1>
                <h2>我組合了TodoItems以及AddTodoForm兩個元件</h2>
                <TodoItems items={todoItems}/>
                <AddTodoForm />
            </div>
        );
    }
});
```

在這邊我們可以看到render方法中我們**宣告了一個todoItems變數，然後將它傳到TodoItems的items屬性裡面**，而要將變數內容傳到React的元件屬性中，則必須用**大誇號{}**包起來。

而在TodoItems元件中，傳進來的todoItems就會放到this.props.items裡面，提供給元件內部使用，其中items就是要接收從外部傳來資料的參數屬性，因此我們的TodoItems元件程式碼就會變成這樣：

```javascript
var TodoItems = React.createClass({
    render: function() {
        var displayItems = this.props.items.map(function(item) {
            return (<li key={item.id}>{item.data}</li>);
        });

        return (
            <div>
                <ul>
                    {displayItems}
                </ul>
            </div>
        );
    }
});
```

在TodoItems的render方法中，我們透過`this.props.items`取得items參數的陣列內容，再利用map方法將它轉換為我們要顯示的HTML(JSX)語法，在這裡可以看到我們指定了key這個屬性，因為**在React中要以陣列方式顯示的資料，都必須給定一個unique的key**，當React將資料轉為顯示的View時會依據這些key給予每個html element不重複的id，如此一來當資料變更時，React就有足夠的依據知道哪些資料需要被變更而那些不需要。

{% note info %}
如果對於key的解釋不是很清楚，現階段只需要知道對於列舉資料的顯示，一定要給一個不可重複的key就對了。
{% endnote %}

現在TodoItems元件已經可以正常顯示要呈現的資料了，我們可以打開瀏覽器看到目前開發的成果：

{% asset_img 001.png %}

可以看到我們的TodoItems元件正確的顯示我們所傳入的兩筆資料，此時若我們打開瀏覽器的開發人員工具(F12)，就可以看到這兩筆資料都會依照我們給定的key來產生對應的id，這裡以Google Chrome的開發人員工具顯示為範例：

{% asset_img 002.png %}

# 使用this.props.children取得節點裡的內容

到目前為止我們已經完成TodoItems的邏輯了，假設我們的<li>標籤有另外的邏輯需要處理，因此我們決定在分割出一個TodoItem(沒有s)的元件，並且將TodoItems改寫為：

```javascript
var TodoItems = React.createClass({
    render: function() {
        var displayItems = this.props.items.map(function(item) {
            // return (<li key={item.id}>{item.data}</li>);
            return (<TodoItem key={item.id}>{item.data}</TodoItem>);
        });

        return (
            <div>
                <ul>
                    {displayItems}
                </ul>
            </div>
        );
    }
});
```

這樣的TodoItem元件該如何設計呢？很明顯我們可以在TodoItem中透過this.props.key來取得key屬性的資料，但{item.data}並沒有透過一個屬性名稱來傳遞，這時候我們就可以使用this.props.children來取得我們JSX跟節點內的內容，因此我們可以寫出一個TodoItem元件如下：

```javascript
var TodoItem = React.createClass({
    render: function(){
        return (<li key={this.props.key}>{this.props.children}</li>);
    }
})
```

再重新整理瀏覽器，一切顯示果然還是正常，太棒了！

# 單元回顧

在本篇文章中我們實際完成了TodoItems的顯示邏輯，也學到了在元件之前傳遞資料的方法，可以使用this.props取得外部傳過來的參數屬性資料，也可以透過`this.props.children`取得元件節點內部的資料內容。

本篇文章的程式碼片段可以到[此Gist瀏覽](https://gist.github.com/wellwind/4888cb39f3e14c3022bd)。

在下篇文章我們再來完成另外一個AddTodoForm元件，順便學習另外一種處理資料的方法：**state**！