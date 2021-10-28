---
title: "[NativeScript]使用Angular CLI來操作NativeScript專案"
date: 2017-03-02 11:11:11
tags:
    - Angular CLI
    - Angular
    - NativeScript
---
今天來談談如何在NativeScript專案中，使用Angular CLI建立component、directive和module等程式，節省開發時間。

<!-- more -->

最近在嘗試用NativeScript開發手機app，能用原來已經熟悉的Angular來開發mobile app，並且能夠直接呼叫原生的手機UI出來操作是一件很爽塊的事情，不過很可惜的是使用NativeScript CLI建立出來的專案無法透過Angular CLI來產生元件，而偏偏又已經習慣了Angular CLI產生元件的方便性，且符合Angular一至的style，每次要建立component或module等等就會覺得有Angular CLI真好...

雖然有一個[nativescript-ngx-magic](https://github.com/wwwalkerrun/nativescript-ngx-magic)能幫助我們整合Angular CLI與NativeScript專案，但老實說這個套件讓程式變的非常醜，而且要改動的幅度不小，還有些bug...最後決定放棄使用，根據[官方issue](https://github.com/angular/angular-cli/issues/698)說未來Angular CLI和NativeScript會有很好的整合，可惜目前還沒有下文...但工作還是要做，專案也必須要go下去（總不能跟老闆說因為沒有好工具所以不開發app了），在觀察過NativeScript CLI產生的專案及nativescript-ngx-magic套件的作法後，還是成功的嘗試把Angular CLI和NativeScript做了整合，今天就來介紹一下整合的步驟。

# 前置準備

首先當然需要安裝Angular CLI和NativeScript CLI

- [Angular CLI](https://github.com/angular/angular-cli)
- [NativeScript CLI](http://docs.nativescript.org/angular/start/quick-setup)

# 速成法：使用已經建好的seed project

如果懶得瞭解具體整合步驟，可以直接用我整合建立好的seed project—[native-script-with-ng-cli](https://github.com/wellwind/native-script-with-ng-cli)，以下是簡單的步驟

1. 複製seed project到本機資料夾

  ```bash
  git clone https://github.com/wellwind/native-script-with-ng-cli.git
  ```

2. 進入資料夾還原npm套件

  ```bash
  cd native-script-with-ng-cli
  npm install
  ```

3. 依照想要模擬的模擬器執行

  ```bash
  npm run start.android
  npm run start.ios
  ```

記得模擬器必須先打開，NativeScript未必會主動幫你為打開的模擬器執行起來，之後就可以看到一個基本的NativeScript App啦！

{% asset_img 0.png %}

另外要提醒的是，NativeScript中@Component的templateUrl的位址是絕對路徑，這與一般使用Angular CLI開發程式時的習慣不同，我們可以手動在@Component的參數物件中加入`moduleId: module.id`，來解決這個問題。

```typescript
@Component({
    moduleId: module.id,
    selector: "app-test",
    templateUrl: "./test.component.html"
})
export class TestComponent implements OnInit {
}
```

# 整合步驟

如果有興趣知道整合的步驟，還可以順便學一些NPM的技巧，再接著往下看吧

1. 使用Angular CLI建立專案

  ```
  ng new native-script-with-ng-cli
  ```

2. 接著進入專案的目錄，把src目錄刪掉
3. 使用NativeScript CLI在原來Angular CLI的專案目錄中建立一個src專案，也就是把原來的src目錄用NativeScript CLI產生的專案取代

    ```bash
    tns create src --ng
    ```

  因為只是把src目錄換掉，但NativeScript的專案目錄本來就很接近Angular CLI產生的src資料夾，因此若把src目錄換掉，我們甚至不用更動**.angular-cli.json(或angular-cli.json)**就可以開始使用Angular CLI來產生component了，但是此時如果直接進入src用`tns run [android/ios]`指令執行時，會出現以下錯誤訊息

  {% asset_img 1.png %}

  沒想到＠types/node在原來專案與src下面的node_modules同時存在，導致出現重複定義的錯誤，把原來Angulc CLI專案的**node_modules/@types/node**目錄刪掉就可以解決這個問題，但手動刪掉node_modules目錄的內容並不是個好習慣，如果專案要交接，也會造成接手人員的混淆，因此我們可以把刪除的命令寫在**package.json**中的**scripts.postinstall**中

  ```
  "postinstall": "rm -rf node_modules/@types/node"
  ```

  {% asset_img 2.png %}

  再執行一次`npm install`，強制postinstall執行，此時再進src目錄使用`tns run [android/ios]`指令，就能正常跑起模擬器了！不過這樣還不夠完美，讓我們繼續來優化整個專案架構

4. 使用rimraf套件

  `rm -rf`指令在linux或mac下可以直接使用，但在windows下如果沒有安裝其他工具如cygwin等等是無法使用的，不過npm上有一個rimraf套件可以幫助我們執行刪除的動作，因此我們直接把他樁到專案中

  ```
  npm install --save-dev rimraf
  ```

  接著把postinstall內容改為

  ```
  "postinstall": "rimraf -rf node_modules/@types/node"
  ```

  這麼亦來以後交接程式時，就不用擔心對方的環境是windows、linux還是mac，通通都可以執行啦！

  接下來我們在針對執行指令上面做一些優化

5. 在package.json中加入方便執行的指令

  目前我們要開啟NativeScript app及模擬器，都需要透過指令進入src資料夾再執行tns run [anrdoid/ios]，不太直覺，且需要下兩次指令才能完成，因此我們可以把這些動作簡化放到package.json的scripts裡面

  ```
  "start.ios": "cd src & tns run ios",
  "start.android": "cd src & tns run android"
  ```

  {% asset_img 3.png %}

  之後只需要執行`npm run start.ios`或`npm run start.android`，就可以順利執行NativeScript app囉！

6. 在.gitignore中設定不加入編譯後的js檔

  在使用ng build指令編譯Angular CLI產生的web專案時，會幫你把程式打包成js檔到另一個目錄下面，但使用tns指令時，每個ts檔都會被編譯成js檔放在一起，但這些js檔其實也只是產出物而已，卻很容易不小心加到版控中，因此我們可以在**.gitignore**中下入以下設定，來**忽略src/app中被編譯的js檔**，另外**src/platforms**及**src/node_modules**也都不是需要加入版控的內容，也一併處理

  ```
  # NativeScript
  src/node_modules
  src/platforms
  src/app/**/*.js
  ```

7. [VSCode]隱藏src目錄下的js檔(建議使用VSCode的朋友執行此步驟)

  最後這是為了讓編輯器美觀用的，在沒這個設定前，我們會看到一堆編譯過的js檔，但我們不會去編輯他，偏偏他會出現在檔案清單中，看起來不太舒服

  {% asset_img 4.png %}

  因此我們可以在**.vscode**中加入一個**settings.json**，並輸入以下內容：

  ```
  {
    "files.exclude": {
      "**/*.js": {
        "when": "$(basename).ts"
      },
      "**/*.js.map": true
    }
  }

  ```

  就能夠發現.js檔都被藏起來了，看起來就清爽多啦！

  {% asset_img 5.png %}

  如果不是使用VSCode，可以參考看看自己所使用的編輯器是否有支援類似的設定功能

# 單元回顧

今天我們把Angular CLI與NativeScript專案密切的整合在一起，雖然不是百分之百完美，但已經非常足夠開發使用了！雖然未來Angular CLI可能會以更好的方式官方的與NativeScript整合，但藉著Angular CLI非常良好的彈性設計，讓我們也能夠自行與各式各樣的平台整合在一起，開發Angular相關專案就是爽快啦！