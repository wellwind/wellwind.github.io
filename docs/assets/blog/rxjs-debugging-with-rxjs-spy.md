---
title: "[RxJS] rxjs-spy：RxJS除錯神器"
date: 2018-03-27 17:08:22
category: RxJS
tags:
  - RxJS
  - Angular
  - rxjs-spy
  - debugging
---

[rxjs-spy](https://cartant.github.io/rxjs-spy/)，是一款專門用來除錯RxJS的套件，透過rxjs-spy，我們可以很輕易的在網頁執行階段理解每一步operator的動作，同時調整現有的observable，來驗證不同邏輯帶來的結果，最棒的是，整個過程幾乎不用動到原來的程式碼，可以說是非常方便的一款library，今天我們就來看看這個神奇的RxJS除錯神器－rxjs-spy吧！

<!-- more -->

{% asset_img logo.png %}

# RxJS的愛恨情仇

RxJS雖然帶來了很方便的開發體驗，但要上手跟熟悉，其實是有比較大門檻的，尤其是operators幫我們將很多行為都包裝的好情境下，反而容易造成無法理解運作原理，以及除錯不方便等問題。

為了除錯方便，使用`do`或是pipeable的`tap`，來印出資料應該是最常見的手段，例如：

```typescript
Observable.interval(1000).do(value => {
    console.log(value);
})

Observable.interval(1000).pipe(
    tap(value => {
        console.log(value);
    })
)
```

不過這樣很容易造成程式裡面一堆不必要的`do`或`tap`，這樣的方式其實會產生不少dirty code，而且當除錯完畢後，還要逐個清理，不然反而會在日後進行其他除錯工作時，console反而印出一堆未清除的雜訊。

有鑑於此，我們需要一套好用的工具，來幫助我們**更加優雅**地針對RxJS進行除錯，也就是今天介紹的主題：**rxjs-spy**

# 關於rxjs-spy

**rxjs-spy**是用來方便針對RxJS除錯的一套library，它可以再盡量不要弄髒程式碼的前提下，印出RxJS的資訊；透過rxjs-spy，我們可以很輕鬆地針對某個串好的observable進行偵錯，在console上看到輸出資訊，而且隨時可以中斷，甚至可以在執行期間抽換某個observable；非常的方便！接下來就讓我們來看看rxjs-spy的神奇魔術吧！

# 使用rxjs-spy來除錯RxJS專案

由於RxJS大量被使用在Angular專案中，因此我們使用Angular專案來做示範，但實際上，在任何專案中只要有使用到RxJS，都可以很輕鬆地透過rxjs-spy來進行偵錯。

## 安裝rxjs-spy

要安裝rxjs-spy非常簡單，透過npm或yarn即可，這已經算是前端起手式了

```shell
npm install --save-dev rxjs-spy
```

接著我們就可以在`main.ts`中建立一個rxjs的spy

```typescript
import { create } from 'rxjs-spy';
const spy = create();
```

{% note info %}

main.ts是Angular專案執行的起點，在其他類型的專案中，可以自行找出應用程式的起點加入

{% endnote %}

## 替observable加上tag

以下是一個簡單的Angular與RxJS的程式範例，透過`Observable.timer()`與`switchMap()`每5秒產生一次request向後端要資料，同時，透過使用rxjs-spy擴充的tag方法，替想要除錯的observable加上一個方便記憶的標籤。

```typescript
import { tag } from 'rxjs-spy/operators/tag';

@Component({ })
export class AppComponent {
  post$ = Observable.timer(0, 5000).pipe(
    tag('app-timer'),
    switchMap((duration) => {
      return this.httpClient.get<any>(`https://jsonplaceholder.typicode.com/posts/${duration % 10 + 1}`)
    }),
    tag('app-post')
  );

  constructor(private httpClient: HttpClient) { }
}
```

rxjs-spy的tag方法支援chain和pipeable兩種，因此上面程式也可寫成：

```typescript
  post$ = Observable.timer(0, 5000)
    .tag('app-timer')
    .switchMap((duration) => {
      return this.httpClient.get<any>(`https://jsonplaceholder.typicode.com/posts/${duration % 10 + 1}`)
    })
    .tag('app-post');
```

看習慣的不同而已，不管是chain還是pipeable，實作上都是回傳一個observer，而tag的概念就是在這個observer加上一個標籤，方便rxjs-spy了解目前有多少個observer是需要被監控的。

有了基本概念後，就可以開始來試玩啦！

接下來我們完全不會再去動到任何的程式碼，全部事情都在瀏覽器的console運作，因此如果你懶得寫上面的程式，可以直接到以下網址試玩：

https://fullstackladder.dev/angular-debugging-with-rxjs/

{% note info %}

為了方便看出debug成果，上述程式並沒有做production build，因此檔案肥大(約3MB)，請稍微耐心等候。

{% endnote %}

{% note info %}

rxjs-spy官方的網站也有載入同樣監控程式碼，因此我們也可以到[rxjs-spy](https://cartant.github.io/rxjs-spy/)練習一樣的過程，只是監聽的tag不同而已。

{% endnote %}

### 使用rxSpy.show()列出所有被監聽的observables

接下來讓我們打開開發人員工具(F12)，在console下輸入`rxSpy.show()`，看看會發生什麼事情：

{% asset_img 01.png %}

可以看到console列出了我們目前定義好的tags，以及這個tag在RxJS中被chain或pipe後的順序，還有目前的狀態，很酷吧！

{% note info %}

值得說明一下的是，在observable還未被subscribe前，rxjs-spy是不會把這些未被subscribe的tag列出來的！

{% endnote %}

### 顯示某個tag

如果只想顯示某個tag的資訊，例如`app-post`可以在參數後加上名稱，例如`rxSpy.show('app-post')`。

#### 使用regular expression搜尋

我們也能夠過regular expression來搜尋tags，例如：`rxSpy.show(/^app-*/)`可以找出所有`app-`開頭的tags。

{% note info %}

後續介紹的方法，幾乎都能使用同樣的方式來處理某個tag

{% endnote %}

### 使用rxSpy.log()開始記錄某個observable的運作

如果想要紀錄某個observable每次輸出的值，可以使用`rxSpy.log({name})`，例如下圖，我們開始記錄`app-post`這個tag每次輸出的結果，輸入`rxSpy.log('app-post')`即可：

{% asset_img 02.png %}

對於要追蹤比較observable的變化時非常方便！

### 使用rxSpy.let()切換observable

如果我們在debug的情境下，想要嘗試看看把某個observer換掉，只要透過`rxSpy.let()`，就可以做到不用改程式，而是直接在console下就能夠抽換：

```javascript
rxSpy.let('people', source => source.mapTo('mallory'));
```

需要注意的是，`rxSpy.let()`只有在把整個RxJS都加入時才實用，以Angular專案(或精準的說：ES6語法)來說，因為都只import要用的operator，因此即使用了`rxSpy.let()`，沒有可用的operator也無法正確的抽換，想要達到抽換功能的話，可以在`environment.ts`中加入` import 'rxjs/Rx'`，來達到把所有operators加入的動作，而在production build時，因為`environment.prod.ts`沒有加入所有的RxJS，所以不用擔心檔案太大的問題。

在小小踩了一下雷之後，我們繼續來用範例學習如何使用`rxSpy.let()`，假如我們想要暫時換掉`app-post`的內容，可以使用以下語法：

```typescript
rxSpy.let('app-post', source => source.mapTo({title: 'test title', body: 'test body'}))
```

再來看看結果：

{% asset_img 03.png %}

果然就換成新的observable資料啦！

### 使用rxSpy.undo()還原步驟

剛剛我們使用`rxSpy.let()`暫時將`app-post`的observable換掉，如果想要還原這個步驟，可以使用`rxSpy.undo()`，在不加任何參數的時候，會記錄所有可以還原的步驟：

{% asset_img 04.png %}

其中第2個步驟就是我們使用`rxSpy.let()`的結果，因此我們可以透過`rxSpy.undo(2)`來還原這個步驟：

{% asset_img 05.png %}

### 使用rxSpy.pause()暫停observable

如果某個observable持續在變化，可能會造成畫面不斷變更，而影響偵錯，這時候我們可以透過`rxSpy.pause()`來暫停某個observable，ex：`rxSpy.pause('app-post')`。

`rxSpy.pause()`會回傳一個`Deck`物件，這個物件有很多好用的方法，例如最簡單的`resume()`，如果想要重新恢復暫停的observable，就可以透過這個方法：

```javascript
const deckPost = rxSpy.pause('app-post');
deckPost.resume();
```

當`rxSpy.pause()`的時候，observable的變化會被當作一步一步的steps被暫存起來，當使用`rxSpy.resume()`時，這些steps的變更會一次完成，而Deck裡面還有幾個非常有趣的API，方便我們一步一步進行除錯：

-   `step()`：執行一次變更，例如原本在`id=6`時暫停，持續發生變化後使用`deck.step()`，會得到`id=7`的結果。
-   `skip()`：跳過一次變更，例如原本在id=6時暫停，之後使用`deck.skip()`，`id=7`就不會發生，此時再接著用`deck.step()`時，就會變成`id=8`。
-   `clear()`：清空所有的變更。

{% asset_img 06.png %}

# 本日小結

今天我們大致介紹了rxjs-spy這個RxJS的除錯神器，以及部分的好用API，來協助我們優雅地針對RxJS進行除錯，而不用去改動太多的程式碼，更不用做一堆事後清理的工作，讓我們的程式碼能夠持續簡潔，又不用擔心RxJS難以除錯的問題，這樣就少一個不去學RxJS的理由了吧XD

# 相關資源

-   [rxjs-spy](https://cartant.github.io/rxjs-spy/)
-   [Debugging RxJS, Part 1: Tooling](https://blog.angularindepth.com/debugging-rxjs-4f0340286dd3)
-   [Debugging RxJS, Part 2: Logging](https://blog.angularindepth.com/debugging-rxjs-part-2-logging-56904459f144)
