---
title: "[Angular 大師之路] 在 @NgModule 的 providers: [] 自由更換注入內容 (1)"
date: 2018-11-04 19:56:37
category: "Angular 大師之路"
tags:
  - Angular
  - NgModule
  - DI
  - providers
  - useClass
  - useExisting
---

相依注入是一般物件導向程式設計的一個大重點，相依注入用得越好程式彈性就越高，而 Angular 本身架構就包含了非常強大的相依注入功能，讓我們自由切換想要注入的實體，今天就來看看在 `@NgModule` 的 `providers: []` 中該如何自由的切換不同注入的內容：

<!-- more -->

**類型**：觀念

**難度**：4 顆星

**實用度**：5 顆星

# 基本架構

在 `@NgModule` 的  `providers: []` 中，放的是多個設定注入資訊的物件，也可以稱為 provider 的類型，每個 provider 物件基本的架構如下：

```typescript
{
  provide: SomeClass,
  useXXXX: YYYY
}
```

這段程式分成兩個重要部分：

- `provide: SomeClass` ：代表要提供的注入內容是什麼，這時後我們會把設定的類別當作是一個 token，在之後的城市內則是選擇要使用這個 token，而這個 token 的具體內容到到底是什麼？則繼續往下設定。
- `useXXXX: YYYY`：`useXXXX` 其實代表了多種設定，包含 `useClass`、 `useExisting`、`useValue`和`useFactory`

今天我們就先來講講 `useClass` 與 `useExisting` 的使用方式：

# useClass

通常我們最常用的是 `useClass` 方法，代表的是使用某個類別，來當做產生 token 的實體，如下：

```typescript
{
  provide: SomeClass,
  useClass: AnotherClass
}
```

當程式內要注入 `SomeClass` 時，Angular 的核心程式就會改成以 `AnotherClass` 來建立新的實體；另外當 `provide` 和 `useClass` 相同時，可以直接簡寫，也就是在 Angular 5 之前我們常見的做法，因此以下兩段程式碼是完全一樣的：

```typescript
@NgModule({
  providers: [
    SomeClass
  ]
})

// 和以下程式完全一樣意思
@NgModule({
  providers: [
    {
      provide: SomeClass,
      useClass: SomeClass
    }
  ]
})
```

# useExisting

`useExisting` 是用來指定已經產生過實體當作 token，舉個例字，一開始程式在設計時，我們可能設計了兩個 service，分別是 `SystemLogger` 和 `GlobalLogger`，有著不同的功用，但分享了一樣的方法簽章；而當時間久了，我們發現 `GlobalLogger` 應該完全用 `SystemLogger` 取代，但原來每個程式都要去改注入的類別，實在太曠石費神了，這時我們可以使用剛才學到的 `useClass`：

```typescript
@NgModule({
  providers: [
    // 原來的 SystemLogger
    SystemLogger,
    {
      // 把 GlobalLogger 換成使用 SystemLogger 產生實體
      provide: GlobalLogger,
      useClass: SystemLogger
    }
  ]
})
```

乍看之下沒什麼問題，但我們通常會希望不要產生那麼多實體，甚至可能需要獨體的行為，而使用 `useClass` 則一定會產生新的實體，因此我們會改成使用 `useExisting`，確保不管注入 `SystemLogger` 還是 `GlobalLogger` 都只會拿到一份 `SystemLogger` 的實體：

```typescript
@NgModule({
  providers: [
    // 原來的 SystemLogger
    SystemLogger,
    {
      // 直接使用 SystemLogger 產生過的實體，而不重新建立
      provide: GlobalLogger,
      useExisting: SystemLogger
    }
  ]
})
```

也可以想像成是把某個類別換的別名(alias name)的概念。

# 相關資源 

- [Dependency Providers](https://angular.io/guide/dependency-injection-providers)
- [ClassProvider](https://angular.io/api/core/ClassProvider)
- [ExistingProvider](https://angular.io/api/core/ExistingProvider)
