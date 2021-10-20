---
title: "[Angular 大師之路] 在 @NgModule 的 providers: [] 自由更換注入內容 (2)"
date: 2018-11-05 21:50:12
category: "Angular 大師之路"
tags:
  - Angular
  - NgModule
  - DI
  - providers
  - useValue
  - useFactory
---

昨天我們提到了在 `@NgModule` 中設定要抽換注入 token 的兩種比較簡單方法，今天我們把剩下兩種稍微複雜的也來介紹一下：

<!-- more -->

**類型**：觀念

**難度**：4 顆星

**實用度**：5 顆星

# useValue

有時候我們不一定會建立一個新的類別來替換另一個 service，也可能只是單純的建立一個跟原來的 service 一樣簽章的物件來替換，這時候就可以使用 `useValue` 來替換掉原來的類別，如下：

假設有個 service 如下：

```typescript
@Injectable({
  providedIn: 'root'
})
export class DataService {
  getData() {
    return 100;
  }
}
```

這時後我們想換成注入某個預先建立好的物件：

```typescript
const newData = {
  getData: () => {
    return 999;
  }
}
```

在設定時就可以使用如下方法：

```typescript
@NgModule({
  providers: [
    {
      provide: DataService,
      useValue: newData,
    }
  ]
})
```

# useFactory

在使用 `useValue` 時，我們是預先建立好要替代的 token 實體，但這種預先建立好有時候並不切實際，因為我們可能在建立實體時會有更多的複雜邏輯，這時候就可以改使用 `useFactory` ，把一個複雜的產生邏輯放到工廠方法裡面，讓工廠方法來幫忙生產實體，一個基本的建立方法如下：

```typescript
const dataServiceFactory = () => {
  return new AnotherDataService();
}

@NgModule({
  providers: [
    {
      provide: DataService,
      useFactory: dataServiceFactory
    }
  ]
})
```

上面程式中我們先建立了一個方法，用來產生 service，在這個方法裡面我們可以寫些複雜的程式來產生不同的實體，也能夠過 `deps: []` 設定，讓這個工廠方法使用外部的 service ，從而決定要產生什麼樣的實體：

```typescript
const dataServiceFactory = (configService: ConfigService) => {
  if (configService.admin) {
    return new AdminService();
  } else {
    return new DataService();
  }
}

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent, HelloComponent],
  providers: [
    ConfigService,
    {
      provide: DataService,
      useFactory: dataServiceFactory,
      // 注入外部相依的 service
      deps: [ConfigService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

大部分的情境，使用 `useValue` 或是昨天提過的 `useClass` 和 `useExisting` 就非常足夠了。但若是有特別的建立需求， 就可以考慮使用 `useFactory` ，來達到最靈活的效果囉！

# 相關資源 

- [ValueProvider](https://angular.io/api/core/ValueProvider)
- [FactoryProvider](https://angular.io/api/core/FactoryProvider)
- [InjectionToken](https://angular.io/api/core/InjectionToken)
