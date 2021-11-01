---
title: "[React速成班]從TodoList範例學習React(3)-透過實作AddTodoForm學習state"
date: 2016-04-03 16:49:51
category: React速成班
tags:
    - React
    - state
---

上一篇文章中，我們學到如何使用props來取得元件傳遞的參數值，也實作了TodoItems及TodoItem元件，藉此了解props的應用。接下來我們將透過實作AddTodoForm部分，來學習React中state的使用。

<!-- more -->

# 關於state

在之前文章中我們已經知道如

在之前文章中我們已經知道如何使用props來取得或傳遞每個元件的參數，然後props在React的世界中是不可以被改變的，以上一篇文章中TodoItem的例子來看，假設我們希望更改`this.props.key`的值，所以寫成這樣

```javascript
var TodoItem = React.createClass({
    render: function(){
        this.props.key = this.props.key + 1; // 更改this.props內容將會出錯
        return (<li key={this.props.key}>{this.props.children}</li>);
    }
})
```

這時侯再重新整理瀏覽器就會一片空白，若以Chrome的開發人員工具檢測，會看到如下圖的錯誤訊息：

{% asset_img 001.png %}

因此若在執行時希望使用可以變更的資料，就必須使用state。在每個元件中我們可以使用`this.state`取得目前元件各自的state內的值，若需要更動state，則可以使用`this.setState()`來改變state的內容，當state內容被改變時，元件將會重新呼render方法。而在每個元件的生命週期裡，我們可以實作`getInitialState`方法，來設定初始化的state資料。

# 繼續完成TodoList

有了基本的state概念後，我們來看看如何將state應用AddTodoForm的元件上。

## 實作AddTodoForm

```javascript
var AddTodoForm = React.createClass({
    getInitialState: function(){
        return {todoText: ""};  
    },
    handleTodoChange: function(e){
        this.setState({todoText: e.target.value});        
    },
    handleAddTodoItem: function(e){
        console.log(this.state.todoText);
        // 如何將資料新增到TodoItems中?  
    },
    render: function() {
        return (
            <div>
                <input type="text" 
                    value={this.state.todoText} 
                    onChange={this.handleTodoChange}/>
                <button
                    onClick={this.handleAddTodoItem}>Add Todo Item</button>
            </div>
        );
    }
});
```
首先我們可以看到getInitialState方法裡我們直接回傳了一個**包含todoText屬性的物件**，這個物件就會變成我們的this.state的內容，所以在render方法中我們的input裡面可以使用`{this.state.todoText}`取得state的todoText內容。

同時我們定義了input的onChange事件由handleTodoChange處理，而handleTodoChange則會呼叫this.setState來更新目前的state內容。接著在button中的click事件我們會用console.log來記錄目前的state中todoText的資訊。

因此重新整理瀏覽器後，在文字方塊中輸入內容，按下按鈕後，可以在開發人員視窗中看到state被變更的結果。

{% asset_img 002.png %}

## 修改TodoList元件內容

接下來在TodoList中我們也可以改為使用state的方式來儲存要顯示的todo資料項目：

```javascript
var TodoList = React.createClass({
    getInitialState: function(){
        return {
            todoItems: 
                [{ id: 1, data: "Item 1" },
                { id: 2, data: "Item 2" }]
        };
    },
    handleAddTodoItem: function(todoText){
        var items = this.state.todoItems;
        items.push({
            id: items.length + 1,
            data: todoText
        });
        this.setState({todoItems: items});
    },
    render: function() {
        return (
            <div className="todoList">
                <h1>Todo List</h1>
                <TodoItems items={this.state.todoItems}/>
                <AddTodoForm addItem={this.handleAddTodoItem}/>
            </div>
        );
    }
});
```

除了以state方式來儲存todo項目以外，我們也**增加了AddTodoForm的addItem屬性**，並**由TodoList的handleAddTodoItem來處理**，而handleAddTodoItem方法中我們傳入一個todoText字串，並且把它加入state中，然後再**透過`this.setState`來更新state內容，讓React知道需要重新render這個元件的內容**。

看到addItem=xxx這樣的寫法是不是很熟悉？沒錯！就是我們上一篇文章介紹的props的用法，只是這次傳入的不是一個資料值，而是傳入handleAddTodoItem，因此在我們的AddTodoForm中，我們就可以透過this.props.addItem()方法，來呼叫這個更新todo項目的方法，所以我們可以改寫AddTodoForm裡的handleAddTodoItem內容：

```javascript
    handleAddTodoItem: function(e){
        // console.log(this.state.todoText);
        // 如何將資料新增到TodoItems中?
        // 呼叫以props傳進來的addItem  
        this.props.addItem(this.state.todoText);
    }
```
這樣就算大功告成啦！我們可以立刻重新整理瀏覽器看到結果如下：

{% asset_img 003.png %}

# 單元回顧

今天我們實作了TodoList最後一個部分AddTodoForm，並學習到state的應用以及一些事件的處理。到目前為止算是對React主要功能做了一個概略性的介紹。

本篇文章的程式碼片段可以到[此Gist瀏覽](https://gist.github.com/wellwind/4888cb39f3e14c3022bd)。

在之後的文章，再來慢慢介紹一些React進階的知識吧！