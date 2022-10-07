---
title: "[Angular 大師之路] 透過 DI 容器修正第三方元件的 bug"
date: 2022-10-07 20:08:13
category:
  - "Angular 大師之路"
tags:
  - "Angular"
  - "DI"
  - "Design Pattern"
---

最進公司內某個專案遇到了一個 bug 是因為第三方套件的已知 bug 導致，但又不可能等人家修好 bug 我們才能處理，於是來詢問我的想法；其實這並不是一個很難的問題，尤其是在 Angular 這種完整個框架下，透過 DI 容器就可以輕易的達成，只是不一定想得到而已，由於大多數我們會使用到 Angular 的 DI 機制常常都是再進行一些組態設定，難得有個案例是用來修 bug 的，就用這篇文章來記錄一下！

<!-- more -->

# 第三方套件的 bug

這是一個已知的 Angular CDK 的 bug，其中的 Overlay 功能在 iOS 下定位會有問題，在撰寫這篇文章時，這個 bug 還沒被修正

相關 issue: https://github.com/angular/components/issues/18890

修正方法在其中也已經討論了，把有問題的 service 中的 `innerHeight` 換成 `clientHeight` 就好了，不過在問題還沒被官方修復前，我們自己的程式如果因此而產生 bug，還是要趕快修正，畢竟客戶是不會等你的！

# 使用 DI 容器修正 bug

一般遇到這個問題，常常想到的解決方法就是把整個元件或相關 class 都複製一份下來修改，然後把用到的地方全部換成自己改好的版本。

雖然複製一份修改這件事情避免不掉，但是如果程式中用到的地方都要修改，那也是很可怕的一件事情，好在 Angular 提供了強大的 DI 容器，只要是透過 DI 容器注入的程式，無論是 component、directive 還是 service 等等，都可以輕易的被置換掉，所以我們可以複製有問題的 service 下來，修正成正確的版本，然後透過 `providers: []` 設定抽換即可！

```typescript
@NgModule({
  ...,
  providers: [
    {
      provide: ViewportRuler,
      useClass: CustomViewportRuler
    }
  ]
})
```

只要如此設定後，該 module 以下 (包含所有的子 module，除非被另外特別設定) 所有注入 `ViewportRuler` 的程式都會改成被注入 `CustomViewportRuler`，即可隨時修正有問題的第三方程式！！

只要瞭解 Angular 的 DI 機制，一定可以理解這種處理方式是非常合理而且簡單的，不過透過 DI 機制修 bug 還是蠻難得的，就在這邊記錄分享一下！

{% note info %}

**OCP 開放封閉原則**

在講到物件導向程式設計時，為了讓程式碼更加穩固，產生了許多的設計原則，其中開放封閉原則（Open/Closed Principle，簡稱 OCP）就是很常見的一種，開放封閉原則代表著：

* 對**擴充**開放
* 對**修改**封閉

當我們發現有一段程式需要調整修改時，符合 OCP 的程式應該會「盡可能」讓我們「不需要」修改原來的程式碼，而是透過「擴充」的方式，以新的程式碼來加強原有的功能。

要達成 OCP 有很多種手段，其中透過相依注入也是一種很常見的手段！

{% endnote %}

# 本日小結

Angular 提供了很強大的 DI 容器，讓我們能很輕鬆的擴充或替換掉原有的功能，並且都不用去動到原來的程式碼；大多數的時間我們都會透過 DI 的方式替程式加上更多功能，例如「[以 HTTP_INTERCEPTORS 來加強 HTTP 呼叫](/blog/2018/11/01/mastering-angular-17-http-interceptors/)」。

即時修正第三方元件的 bug 是一個難得的經驗，讓我們再次體會到的 DI 的重要性，而不是死板版的一直在建構式注入而已，也讓我們有了更多案例，瞭解如何更加活用 DI 這種美妙的機制！
