---
title: "[Angular進階議題]fakeAsync/tick－在Angular中測試非同步程式的時光魔術師！"
date: 2017-08-07 11:11:11
category: "Angular進階議題"
tags:
    - Angular
    - fakeAsync
    - tick
---
Angular本來就是個把測試也考量進去的前端框架，因此提供了不少測試工具，由於現在寫JavaScript勢必會大量使用各種非同步執行的方式撰寫，因此Angular也提供了一些API讓我們在測試非同步執行的程式時更加容易，今天要講的fakeAsync跟tick就是其中一個神奇的工具！

<!-- more -->

# 關於非同步程式的測試

首先先來看看一般情況下如何測試非同步程式，假設我們有個Service程式內容如下：

 ```typescript
@Injectable()
export class AsyncService {

  theNumber: number;

  constructor() {
    this.theNumber = 0;
  }

  theMethod() {
    setTimeout(() => {
      this.theNumber = 10;
    }, 1000);
  }
}
``` 

這時要測試`theMethod()`時，使用AngularCLI產生的測試框架預設使用Karma+Jasmine，寫出來的測試可能長這樣

 ```typescript
describe('AsyncService', () => {

  let testTarget: AsyncService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AsyncService]
    });

    testTarget = TestBed.get(AsyncService);
  });

  it('呼叫theMethod之後theNumber應該為10', () => {
    testTarget.theMethod();
    expect(testTarget.theNumber).toBe(10);
  });
});

``` 

不難看出這樣的測試程式結果一定是錯的，由於theMethod()是非同步執行的，要**在1000毫秒後才會將theNumber設為10**，因此在呼叫theMethod()後立刻使用expect()檢查一定是錯的！

要解決這個問題也不難，把**theMethod()裡面的程式用Promise包起來，接著搭配Jasmine內建的done就可以了**。

theMethod()內容如下：

 ```typescript
  theMethod() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.theNumber = 10;
        resolve();
      }, 1000);
    });
  }
``` 

測試程式如下：

 ```typescript
  it('呼叫theMethod之後theNumber應該為10', (done) => {
    testTarget.theMethod().then(() => {
      expect(testTarget.theNumber).toBe(10);
      done();
    });
  });
``` 

就可以正常執行了沒有問題！

# 搭配fakeAsync/tick使用

上述是一般測試非同步成的簡單方法，不過這麼做其實有點問題，畢竟theMethod()裡面的內容很單純，如果只是為了方便寫測試程式而去動原來的production code，未免讓人感到心裡不舒服，而且也因此**在production code和test code都造成了不必要的callback**，讓程式可讀性也變得比較差！這時候我們可以使用fakeAsync與tick搭配，用**同步執行的程式碼模擬非同步的效果**！

我們可以先把theMethod()的Promise拿掉，並重新把測試程式用fakeAsync包起來，並且在呼叫theMethod()後，執行`tick(500)`，來模擬500毫秒過去後的變化(此時還沒改變theNumber的值)，再次執行`tick(500)`，代表總共1000毫秒過去了：

 ```typescript
  it('呼叫theMethod之後theNumber應該為10', fakeAsync(() => {
    testTarget.theMethod();
    tick(500);
    expect(testTarget.theNumber).toBe(0);
    tick(500);
    expect(testTarget.theNumber).toBe(10);
  }));
``` 

如此一來主要的測試程式碼就不會產生不必要callback，原來的production code也不需要因此特地把程式改成Promise版本，一切看起來就像是同步執行的程式一樣，更重要的是，原來因為程式碼中setTimeout的關係，在測試這支程式時是必須要等待個1000毫秒，但透過tick模擬時間快轉效果，完全不需搖額外的等待，簡直就像是施放了<span style="color:#0000CD;">時光魔術</span>一樣，實在太神奇啦！

tick中的參數是用來**讓時間產生快轉的效果**，但大多非同步的程式並不會有類似setTimeout這固定延遲的狀況，像是ajax呼叫等等，此時我們會替這些程式設計測試替身，由於不會有無謂的延遲，我們就不須在tick中加入任何參數(預設值為0)。

 ```typescript

  it('假設theMethod非同步但不會延遲1000毫秒，直接用tick()就好', fakeAsync(() => {
    spyOn(testTarget, 'theMethod').and.callFake(() => {
      setTimeout(() => {
        testTarget.theNumber = 999;
      });
    });
    testTarget.theMethod();
    tick();
    expect(testTarget.theNumber).toBe(999);
  }));
``` 

# 關於fakeAsync/tick的補充

雖然前文提到fakeAsync/tick是Angular提供的測試工具，但其實它是由[Zone.js](https://github.com/angular/zone.js)提供的測試工具(不過Angular又再包了一層)，而Angular則是透過Zone.js來管理非同步的程式執行及進行變更偵測決定畫面重新產生的時機，因此我們的Angular程式本來大部份就在Zone的管轄範圍之中，這樣的搭配也使得我們在Angular中撰寫非同步執行的測試程式時更加容易，開發更加輕鬆啦！

程式碼位置：[https://github.com/wellwind/angular-advanced-topic-demo/tree/master/testing-with-fakeasync](https://github.com/wellwind/angular-advanced-topic-demo/tree/master/testing-with-fakeasync)

參考資料：

[https://angular.io/guide/testing#the-fakeasync-function](https://angular.io/guide/testing#the-fakeasync-function)

[https://angular.io/api/core/testing/fakeAsync](https://angular.io/api/core/testing/fakeAsync)