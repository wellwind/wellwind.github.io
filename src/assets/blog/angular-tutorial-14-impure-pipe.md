---
title: "[Angular速成班]使用Pipe輕鬆改變view上的顯示內容(3)-Impure Pipe參數：關於Pipe最重要的小事"
date: 2017-02-12 11:11:11
category: "Angular速成班"
tags:
    - \@Pipe
    - Angular
    - Pure Pipe
    - Impure Pipe
    - AsyncPipe
---
前兩篇文章我們已經認識了[Pipe的使用方法](http://wellwind.idv.tw/blog/2017/02/06/angular-tutorial-12-pipe-basic/)以及[如何自訂Pipe](http://wellwind.idv.tw/blog/2017/02/09/angular-tutorial-13-customize-pipe/)，基本上已經非常實用了，今天在Pipe的最後一篇要稍微深入的解釋自訂Pipe的一個小參數：**pure**。

<!-- more -->

# 關於Angular的變更偵測機制

我們先很簡單的說明Angular的變更偵測機制，在預設情況下Angular只在以下兩種狀況發生時會偵測資料變更

1.  JavaScript基本（primitive）型別的資料變更時
2.  整個物件參考被變更時

因此之前的實做其實會有一個bug，我們原本的TodoListService.toogleItemStatus()程式內容為：

```typescript
  toogleItemStatus(item: TodoItem) {
    item.done = !item.done;
  }
```

這樣的程式其實只是改變了一個物件的屬性而已，而非整個物件參考改變，所以當我們把TodoItem的資料變更時，Pipe其實沒接收到正確的變更資料

{% asset_img 0.png %}

所以我們只要將程式調整為：

```typescript
  toogleItemStatus(item: TodoItem) {
    item.done = !item.done;
    // 給予一個新的物件參考
    this.todoItems = [...this.todoItems];
  }
```

就沒有問題啦！

{% asset_img 1.png %}

# 關於Pure Pipe

還記得上篇文章我們建立Pipe時，在類別上方的＠Pipe decorator嗎？在這個decorator中主要有一個name的參數；但其實還有一個pure參數，預設值為true，代表這個Pipe是一個Pure Pipe，而在Pure Pipe中，Angular的處理行為跟預設的變更偵測機制是一樣的，因此只有當整個傳入的基礎行別被變更﹑或是傳入的物件整個參考被改變時，才會重新執行Pipe裡面的transform()，因此假設我們調整一下我們之前的Pipe，把整個TodoItem傳入時，問題就會再次發生了：

View調整為：

```html
<span>{{ item | todoDone:true }}</span>
```

Pipe程式調整為： 

```typescript
@Pipe({
  name: 'todoDone'
})
export class TodoDonePipe implements PipeTransform {

  transform(todoItem: TodoItem, displayNotDone: boolean): any {
    if (todoItem.done) {
      return '(已完成)';
    } else if (displayNotDone) {
      return '(未完成)';
    }
    return '';
  }
}
```

再重新執行程式看看，就會發現問題又發生了，這時候我們就需要**Impure Pipe**了

# 關於Impure Pipe

接下來就是今天的重頭戲—Impure Function啦！要將一個Pure Pipe變成Impure Pipe很簡單，只需要將@Pipe裡面加上`pure: false`即可

```
@Pipe({
  name: 'todoDone',
  pure: false
})
```

這時若再回頭重新執行程式，就可以發現一切就恢復正常啦！

雖然說是恢復正常，但必須要強調的是，Impure Pipe會導致Angular非常頻繁的對Pipe傳入的資料進行變更偵測，這很容易會導致我們程式的效能變差，因此實際設計上最好：

1.  盡量使用Pure Pipe
2.  不要在Pipe內變更物件的狀態（因為Pure Pipe也不會偵測到...)

# 關於Async Pipe

接著我們再介紹一個Angular中內建的Pipe—**AsyncPipe**；AsyncPipe可以接收一個**ES6的Promise或RxJs的Observable**，並主動去處理.then()或主動為Observable進行subscribe的動作，由於內部的狀態是會變更的，因此AsyncPipe就是被設計成一個Impure Pipe，我們可以直接[到GitHub看到AsyncPipe的程式碼](https://github.com/angular/angular/blob/master/modules/@angular/common/src/pipes/async_pipe.ts)，確實是宣告成Impure Pipe，關於AsyncPipe的用法，也可以[直接參考文件中AsyncPipe的使用說明](https://angular.io/docs/ts/latest/guide/pipes.html#!#async-pipe)；不會很困難就不多加介紹了...

# 單元回顧

今天我們學到Pipe中最後一個重點—Impure Pipe，使用Impure Pipe可以讓Angular更加積極的進行變更偵測，但也會導致效能降低，因此應該盡可能的設計成Pure Pipe，但當沒有辦法時，我們還是可以使用Impure Pipe，來讓Pipe的設計更加靈活！達到我們在View上呈現資料無死角的目標！！

本日程式碼：[https://github.com/wellwind/AngularDotblogsDemo/tree/ImpurePipeDemo](https://github.com/wellwind/AngularDotblogsDemo/tree/ImpurePipeDemo)