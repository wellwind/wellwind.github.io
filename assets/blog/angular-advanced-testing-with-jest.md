---
title: "[Angular進階議題]Karma + Jasmine跑測試太慢？試試看Jest吧！"
date: 2017-08-13 11:11:11
category: "Angular進階議題"
tags:
    - Angular
    - Jest
    - Snapshot Testing
---
[Jest](http://facebook.github.io/jest/)是由Facebook開發出來的測試框架，就算Jest跟React是同一個爸爸，要拿來跑Angular的測試卻也沒有問題！今天就來看看如何把Jest套在Angular的專案上吧。

<!-- more -->

# Why Jest?

比起Angular CLI預設使用的Karma + Jasmine，個人使用Jest來跑測試有幾個優點：

1. **更快速**：Angular CLU架構下的Karma + Jasmine必須先把完成的Angular程式編譯一次，再開啟瀏覽器跑測試；而Jest只需要用node即可，搭配jsdom，不需要整個專案編譯，甚至不需要開啟瀏覽器即可測試！
2. **更清楚**：當然這是主觀的問題，但個人覺得Jest輸出的測試結果清楚多了。
3. **Snapshot Testing**：這是Facebook提出的一種測試概念，在執行測試時，先把測試結果做一份snapshot，之後修改程式重跑測試時，只需要比對snapshot是否不同，即可知道是否有改壞程式的問題，讓測試變得更加輕鬆，這個feature目前也只能在Jest中使用。
4. 推坑容易(?)：如果想要推薦再寫React+Jest測試的朋友進入Angular，可以跟他說“我們也能用Jest跑測試程式喔”，試圖把他推入Angular的坑中(誤)。

# 在Angular專案中使用Jest

接下來就是重頭戲啦，我們要在Angular專案中使用Jest，需要搭配大神已經做好的[jest-preset-angular](https://github.com/thymikee/jest-preset-angular)，作者建議使用Angular CLI 1.0以上，並產生Angular 4版本以上的專案，產生專案後我們可以把jest測試相關的套件都裝進來：

```shell
yarn add --dev jest jest-preset-angular @types/jest
```

接著在package.json加入jest-preset-angular的設定

```json
"jest": {
  "preset": "jest-preset-angular",
  "setupTestFrameworkScriptFile": "<rootdir>/src/setupJest.ts"
}
```

接著在src目錄中建立一個setupJest.ts

```
import 'jest-preset-angular';
import './jestGlobalMocks';
```

由於Jest使用jsdom來模擬DOM的內容而不是真正開啟瀏覽器去跑，因此有些瀏覽器功能如localStorage等等會出現問題，這時候我們可以自己再產生一個jestGlobalMocks.ts，來建立全域的測試替身

```typescript
const mock = () => {
  let storage = {};
  return {
    getItem: key => key in storage ? storage[key] : null,
    setItem: (key, value) => storage[key] = value || '',
    removeItem: key => delete storage[key],
    clear: () => storage = {},
  };
};

Object.defineProperty(window, 'localStorage', {value: mock()});
Object.defineProperty(window, 'sessionStorage', {value: mock()});
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ['-webkit-appearance']
});
```

當然這不是一定必要的，有需要在mock就好，不過根據作者的說法，getComputedStyle是必須的，但根據自己的測試情況，就算沒有也不會出問題，可能是jsdom改版了，也可能是我測試的例子不夠多，因為不確定原因，加上尊重原著，還是把這段放上來說明。未來有機會搞懂原委後，再來補充說明。

最後我們就只需要把測試的命令加到package.json，就可以開始跑看看啦！

```
"test:jest": "jest",
"test:jest-watch": "jest --watch",
"test:jest-coverage": "jest --coverage"
```

# 實際運行結果

使用Angular CLI建立新專案時，已經內建了3個簡單的測試案例(app.component.spec.ts)：

```typescript
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app');
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to app!');
  }));
});
```

先來看看使用內建的Karma + Jasmine跑出來的結果：

{% asset_img 1.gif %}

指令開始後，從打包程式到啟動瀏覽器跑測試，大約花了13秒左右！

再來看看Jest的成果吧！

{% asset_img 2.gif %}

整個過程只花了4秒鐘左右！！省去打包跟用瀏覽器跑測試的時間，就是快多了！

# Code Coverage

Jest也內建了code coverage功能，能夠快速看到測試程式的覆蓋率

{% asset_img 2.png %}

# Snapshot Testing

最後來看看Snapshot Testing吧，這可是吸引我想要用Jest測試的一大主因啊！

在目前的測試案例中，有兩個只要是測試view結果的，使用snapshot測試時，我們可以很輕鬆的合併成一個測試案例！

```typescript
  it('should match snapshots', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  }));
```

主要的重點是使用`fixture.detectChanges();`進行變更偵測後，搭配`expect(fixture).toMatchSnapshot();`針對snapshot做比對。

{% note info %}  

記得 `import 'jest';` 可以享用auto complete的優勢！

{% endnote %}  

第一次執行時，由於沒有snapshot檔，會**主動幫我們把預設的結果拍照一份下來**：

{% asset_img 3.png %}

同時在測試程式檔案的同目錄中會產生一個`__snapshots__`資料夾，裡面的內容就是這次跑測試產生的結果

{% asset_img 4.png %}

這時候我們可以修改程式看看，讓產生的內容與snapshot的內容不一致，Jest偵測到snapshot比對失敗後，會跳出提示告訴你不同的地方在哪裡，以及是哪個測試程式出了問題：

{% asset_img 5.png %}

如果這是不小心改錯的，我們應該回去修改原來的程式，直到snapshot testing不會報錯為止；如果這是因為需求而修改，本來就該如此呈現，可以按下`u`，來更新snapshot的內容。

{% asset_img 6.png %}

**等於幫我們把測試程式預期的結果自動做了更新，我們就不用特地再去修改原來的測試程式了**，很方便吧！

{% note info %}  
小心得：剛接觸Snapshot Testing時非常興奮，但隨之而來想到的問題是「**用Snapshot Testing可以進行TDD嗎？**」，乍看之下在觀念上好像就不合，畢竟TDD是先把答案寫好，再寫過程(紅燈->綠燈)，而Snapshot Testing則是先預設你是對的(一開始就綠燈)，再來調整程式。  

不過仔細思考後，覺得Snapshot Testing要做TDD也不是這麼困難，只是流程上要調整一下而已：  

1. 先用一般的TDD習慣寫程式，也就是不要用toMatchSnapshot，而是一般的TDD方式，進行「紅燈 -> 綠燈」的開發流程  
2. 等到確定綠燈之後，再把原來的toXXXX改成toMatchSnapshot，這時候就在跑測試程式就會把綠燈的結果snapshot起來  
3. 之後進行重構時，只要直接比對snapshot就好，完全不用思考太多囉！  
{% endnote %}  

# 本日回顧

今天我們嘗試把Jest測試框架套到了Angular，讓測試程式跑起來更快速，Jest是個方便快速的測試框架，搭配jsdom，即使是web開發，我們也不一定需要用瀏覽器來跑測試程式，因此速度可以得到一定的提升；也內建了code coverage功能讓我們得以了解測試程式的保護程度；還有snapshot testing，讓寫測試變得更加簡單<s>，推坑也更好推囉</s>！

今天的程式碼：[https://github.com/wellwind/angular-advanced-topic-demo/tree/master/testing-with-jest](https://github.com/wellwind/angular-advanced-topic-demo/tree/master/testing-with-jest)

參考資源：

Jest：[http://facebook.github.io/jest/](http://facebook.github.io/jest/)

如何把Jest套在Angular專案中，本篇文章主要是參考這裡：[https://www.xfive.co/blog/testing-angular-faster-jest/](https://www.xfive.co/blog/testing-angular-faster-jest/)

實現今天目標最重要的套件：[https://github.com/thymikee/jest-preset-angular](https://github.com/thymikee/jest-preset-angular)