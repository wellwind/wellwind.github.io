---
title: "[Angular進階議題]使用shareReplay operator避免ajax時async pipe重複發request的問題"
date: 2017-08-10 11:11:11
category: "Angular進階議題"
tags:
    - RxJS
    - Angular
    - AsyncPipe
---
Angular內建了一個[async pipe](https://angular.io/api/common/AsyncPipe)，讓我們在view中處理非同步資料時更加輕鬆，不論是Promise還是Observable都不需要額外做then或subscribe的動作，只要在view中加入async這個pipe就可以自動把該做的事情都做好，但當當一個非同步的結果會在不同地方顯示時，用async pipe就會發生重複處理的問題，這時就可以搭配RxJs的[shareReplay](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/sharereplay.md) operator來解決這個問題。

<!-- more -->

假設我們有個非同步的程式如下：

 ```typescript
  ngOnInit() {
    this.data$ = this._simulateRequest();
  }

  private _simulateRequest(): Observable <any>{
    return Observable.create((observer: Observer<any>) => {
      console.log('模擬request發生了...');
      observer.next({ foo: 'bar' });
      observer.complete();
    });
  }

```</any></any> 

接著view的內容為：

 ```html

# 第一次request

  {{ data$ | async | json}}

# 第二次request

  {{ data$ | async | json}}

# 第三次request

  {{ data$ | async | json}}

``` 

跑出來的結果如下圖：

{% asset_img 0.png %}

這個結果非常好理解，因為async pipe本來就是幫我們去做subscribe的動作，每次subscribe就會去執行Observer.create()裡面的內容，不過當我們資料是透過ajax呼叫時，就必須呼叫3次，這樣**可能**會造成一些不必要的網路資源浪費。

當然最簡單的方式是透過自己subscribe一次後把資料放到一個變數中，而不再去使用async pipe：

 ```typescript
    this._simulateRequest().subscribe(returnData => {
      this.data = returnData;
    });
``` 

但這樣總是感覺醜了一點，不過好加在RxJs提供了大量的operators來解決各式各樣的難題，我們可以利用shareReplay(N)來“重播”最近N次的節果，以一般ajax來說只會發生一次就complete了，所以裡面參數有沒有設定都沒關係，把原來request的程式稍微改寫一下：

 ```typescript
this.data$ = this._simulateRequest().shareReplay();
``` 

就不會發生重複request的結果啦！

{% asset_img 1.png %}

果然RxJs玩到後來就是比誰會的operators多啊XD

程式碼範例：[https://github.com/wellwind/angular-advanced-topic-demo/tree/master/using-share-operator](https://github.com/wellwind/angular-advanced-topic-demo/tree/master/using-share-operator)