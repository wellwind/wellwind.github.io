---
title: "[Angular速成班]使用Pipe輕鬆改變view上的顯示內容(2)-自訂Pipe讓內容顯示無死角"
date: 2017-02-09 11:11:11
category: "Angular速成班"
tags:
    - \@Pipe
    - Angular CLI
    - Angular
---
上一篇文章我們介紹了[Angular中內建的Pipe](https://dotblogs.com.tw/wellwind/2017/02/06/Angular-pipe-basic)，讓我們更容易在View中直接改變資料的顯示方式，今天我們來說明如何設計自己的Pipe。

<!-- more -->

# 使用自訂Pipe的時機

使用Pipe雖然有很多好處，但很多時候我們其實不一定要用Pipe來解決，畢竟寫在Component直覺又簡單，何必非要用到Pipe呢？個人認為以下兩種情況，會是使用Pipe的良好時機

1. **轉換邏輯太複雜時**：假設我們遇到一個複雜的轉換邏輯，沒個2~300行是無法完成的，寫在Component中可能會不小心造成一個太過肥大的Component，這樣的程式是不易於維護的。當簡單的轉換邏輯因需求異動而漸漸變複雜時，也是個切出Pipe的良好時間點。
2. **轉換邏輯在很多地方都需要使用時**：我想這就不用多說了吧！如果只有單一個Component需要使用，邏輯又不複雜時，寫在Component中當作一個Component的feature也是完全沒問題的，但當重複使用的需求出現時，就是很好的切出Pipe的時機啦！

# 開始使用Pipe

在我們之前的TodoApp中，有一個顯示`(已完成)`的功能，程式碼如下：

```html
<span *ngif="item.done">(已完成)</span>
```

我們想要把他改成使用Pipe的方式來處理資料，希望變成如下的程式碼：

```html
<span>{{ item.done | todoDone:false }}</span>
```

其中`todoDone`就是我們即將要建立的TodoDonePipe，這個Pipe我們還帶了一個參數，**當資料未完成時，若參數為false，不顯示資料；若參數為true則顯示(未完成)**。

# 建立Pipe

有了基本的需求規劃後，就可以開始建立Pipe啦！首先先透過Angular CLI建立一個Pipie

```shell
ng g p todo-done
```

此時會產生src/app/todo-done.pipe.ts的檔案，內容如下

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'todoDone'
})
export class TodoDonePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return null;
  }
}
```

這就是一個基本的Pipe程式架構啦！在這段基本架構中我們又學到了一個新的@Pipe decorator，只要加上@Pipe的類別，都可以在View上當作Pipe使用哩！而所有要轉換的邏輯必須寫在`transform()`裡面，把轉換後的結果回傳回去；接著就根據前面的需求把轉換的程式碼填進去吧

```typescript
  transform(todoDone: boolean, displayNotDone: boolean): any {
    if (todoDone) {
      return '(已完成)';
    } else if (displayNotDone) {
      return '(未完成)';
    }
    return '';
  }
```

再重新整理程式，就可以看到一樣的結果啦！此時我們可以修改看看原來使用TodoDonePipe的參數看看

```html
<span>{{ item.done | todoDone:true }}</span>
```

執行結果

{% asset_img 0.png %}

原本預設未完成是不會顯示的，但我們在自訂Pipe及參數後，也可以根據我們的需要改變顯示結果了，Pipe很好用吧！！

# 單元回顧

今天我們學到了Angular中如何自訂Pipe的方式，透過自訂Pipe的方式，我們在View上顯示資料就沒有死角啦！

程式碼：

[https://github.com/wellwind/AngularDotblogsDemo/tree/CustomizePipeDemo](https://github.com/wellwind/AngularDotblogsDemo/tree/CustomizePipeDemo)