---
title: "[Angular 大師之路] 模組化的基本觀念"
date: 2018-10-21 20:21:59
category: "Angular 大師之路"
tags:
  - Angular
  - NgModule
---

昨天我們簡單介紹了一個模組中的 `@NgModule` 應該要放些什麼資料，今天我們來理解一下實務上開發 Angular 應用程式時，常見的一些模組化的方式。

<!-- more -->

**類型**：觀念

**難度**：4 顆星

**實用度**：5 顆星

# FeatureModule

FeatureModule 的基本概念是，針對應用程式本身的領域，依照功能來分割成不同的模組，舉個例子來說，當我們在設計一個內容管理系統後台時，可能會依照功能切成使用者管理、權限管理和內容管理等幾種模組，每個模組可能就是一個功能的頁面，每個頁面下再由更多的元件等組成；而像是 Angular Material 這種元件庫，則可能依照不同的元件或功能類型，分割成不同的模組。

以一般應用程式來說，使用頁面或功能來分割模組時，有可能會有以下情境：

{% note info %}

我有一個使用者管理頁面，因此建立一個 `UserModule` ，來放置跟管理使用者頁面相關的程式

{% endnote %}

以 Angular Material 這種元件庫來說，則有可能出現類似這樣的情境

{% note info %}

我想要設計一個跟下拉選單功能相關的元件，因此建立一個 `DropdownModule` ，來放置跟下拉選單相關的程式

{% endnote %}

# SharedModule

在一個應用程式中，很多的程式有很高的機會被重複使用，此時我們會選擇將這些共用的程式使用一個 SharedModule 來管理，例如我們再開發某個頁面時設計了一個元件用來表示搜尋文字框，因此建立了一個 `SearchComponent` 的程式，此時程式可能看起來如下：

```typescript
@Component({ ... })
export class SearchComponent { }

@NgModule({
  declarations: [SearchComponent]
})
export class PageOneModule { }

```

而當另外一個頁面在開發時發現也有這個元件的功用需求，此時就可能將 `SearchComponent` 移動到所謂的 SharedModule 中，新的程式碼變成：

```typescript
@Component({ ... })
export class SearchComponent { }

@NgModule({
  declarations: [SearchComponent],
  exports: [SearchComponent]
})
export class SharedModule { }

@NgModule({
  imports: [SharedModule],
  ...
})
export class PageOneModule { }

@NgModule({
  imports: [SharedModule],
  ...
})
export class PageTwoModule { }
```

在上面程式中，我們將 `SearchComponent` 放到了 `SharedModule` 的 `declarations: []` 之中，為了在其他模組中也能使用這個元件，在 `exports: []` 做一個再次匯出的動作；此時 `PageOneModule` 以及 `PageTwoModule` 只需要在 `imports: []` 加入 `SharedModule` ，即可直接使用其中的 `SearchComponent` 達到程式碼共用的目標。

如果當 SharedModule 內沒有其他樣板使用到 `SearchComponent` ，代表 `SearchComponent` 只有不會在 `SharedModule` 內部使用到，只有其他外部模組會用到，此時可以從 `declarations: []` 中移除，如下：

```typescript
@NgModule({
  declarations: [...],
  exports: [SearchComponent]
})
export class SharedModule { }
```

在 `SharedModule` 的 `exports: []` 中，此時在使用 `SharedModule` 的模組也代表加入了對應的模組，透過這種方式，我們也能減少很多不必要的 `import: []` 設定；舉例來說，當我們使用 Angular Material 時，很可能建立一個 `MaterialSharedModule`，以及在 `exports: []` 加入想要使用的模組，如下：

```typescript
@NgModule({
  // 集中第三方元件庫的模組
  exports: [MatInputModule, MatSelectModule, MatButtonModule]
})
export class MaterialSharedModule { }

@NgModule({
  imports: [MaterialSharedModule],
  ...
})
export class PageOneModule { }
```

在上面程式中，我們建立了 `MaterialSharedModule`，來管理共用的 Angular Material 元件模組，並將這些模組放到 `expots: []` 內，此時在其他頁面只需要加入 `MaterialSharedModule`，就代表將裡面 `exports: []` 設定的程式都歸類到此模組下了！算是一種很常見且很方便的技巧。

# CoreModule

在 Angular 6 之前，當我們建立 service 時，會在需要使用此 service 的模組中的 `providers: []` 加入此程式，在一個模組內，每個 service 都只會被產生一次(也就是屬於 singleton 的)，但當一個 service 有共用需求時，可能會選擇加入 `SharedModule` 的 `providers: []` 中，如下：

```typescript
@Injectable()
export class SearchService { }

@NgModule({
  providers: [SearchService]
})
export class SharedModule { }

@NgModule({
  imports: [SharedModule]
})
export class MainModule { }

@NgModule({
  imports: [SharedModule]
})
export class OtherModule { }
```

由於每個模組都會加入 `SharedModule`，導致每個模組都會重新產生一次這個 service，也就是在每個模組內拿到的 service 都是不同的實體，造成資料難以在不同的模組間透過 service 共用，因此產生了一個 CoreModule 的觀念，我們會將所有需要 singleton 的 service 都放入一個 `CoreModule` 的 `providers: []` 之中，並且只在 `AppModule` 中加入一次，且不允許其他模組加入 `CoreModule` ，當 Angular 在建構式注入某個 Service 時，就只會往上從 AppModule 中的 `CoreModule` 找到，以避免被重複建立的狀況：

```typescript
@Injectable()
export class SearchService { }

@NgModule({
  providers: [SearchService]
})
export class CoreModule { }

@NgModule({
  // 在這裡不可以再加入 CoreModule，以免取得不同的實體
})
export class MainModule { }

// 只在 AppModule 加入 CoreModule
// 其他模組內找不到 service 時就會向外找到 AppModule 中 CoreModule 內的 service
// 此時就可以確保只拿到一個實體
@NgModule({
  imports: [BrowserModule, CoreModule, MainModule],
  ...
})
export class AppModule { }
```

## @Injectable 中的 providedIn

在 Angular 6 之後，service 的 `@Injectable` 內多了一個 `providedIn` 的設定，我們可以直接設定為 `root` 字串，就可以達到如同 CoreModule 的效果，不再需要加入到任何模組的 `providers: []` 中。

`providedIn` 的設定的原本用意為，此服務是屬於哪個模組之內，在過去我們會將 service 放到 `providers: []` 中，但這種方式若模組內沒有任何一個程式使用到此 service 時，在打包程式是無法過濾掉這支程式的，而改用 `providedIn` 的方式則可以確保當沒有任何程式使用到此 service 時，確實過濾掉這支程式，進一步減少程式的大小。

當設定為 `providedIn: 'root'` 時，代表這個 service 一定會被註冊在根模組之下，因此也能確保 service 是 singleton 的。

`providedIn` 除了設定為 `root` 字串以外，也可以指定使用的模組，如 `providedIn: SomeModule`，但可能會產生一樣的問題，甚至不小心衍生更多問題，因此建議直接都設定為 `root` 就好，尤其是當有明確 singleton 需求時。

{% note info %}

在 Angular CLI 6+ 之後，建立的 service 自動會加上 `provided: 'root`'。

{% endnote %}

# 本日小結

今天介紹了基本的模組切割概念，基本上分成三種

- **Feature Module**：依照不同的類型將程式**分割**成不同模組
- **Shared Module**：將共用的程式**組合**成一個新的模組
- **Core Module**：當應用程式有 singleton 需求時，把所有 service 統一在此模組內，此方法在 Angular 6 後使用的機會開始漸漸減少

有了這些觀念，在規劃程式模組時就能更加得心應手囉！

# 相關資源

- [Feature Modules](https://angular.io/guide/feature-modules)
- [Types of Feature Modules](https://angular.io/guide/module-types)
- [Sharing Modules](https://angular.io/guide/sharing-ngmodules)
- [Singleton services](https://angular.io/guide/singleton-services)
