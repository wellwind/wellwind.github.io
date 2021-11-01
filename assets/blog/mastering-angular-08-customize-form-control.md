---
title: "[Angular 大師之路] 自訂表單控制項"
date: 2018-10-23 21:09:34
category: "Angular 大師之路"
tags:
  - Angular
  - Two Way Binding
  - ngModel
  - NG_VALUE_ACCESSOR
  - ControlValueAccessor  
---

昨天我們介紹了一個簡單的方法來實作 two way binding，這種方法在很多情境都非常好用，不過他還是有一些小問題，有些我們會需要在表單中使用自己設計的元件，但若使用 `@Input` 加上 `@Output` 的方法，會無法使用到在 Angular 中表單控制項的一些好處，例如加上驗證器的功能，也沒有一些如 `ng-dirty` 、 `ng-invalid` 等 CSS class 可用。因此今天我們來聊聊如何自己設計一個表單控制項吧！

<!-- more -->

**類型**：技巧

**難度**：5 顆星

**實用度**：5 顆星

# 自訂 NG_VALUE_ACCESSOR

接著建立一個要成為表單控制項的元件(ex: `MyControlComponent`)之後，在檔案上加上以下程式：

```typescript
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Component, OnInit, forwardRef } from '@angular/core';

export const MY_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MyControlComponent),
  multi: true
};
```

在這段程式中，我們宣告了一個常數 `MY_CONTROL_VALUE_ACCESSOR`，並在裡面設定 `NG_VALUE_ACCESSOR` 這個可被注入的 token，並將此 token 設定為使用現有的 `MyControlComponent`。

Angular 在執行元件程式時，會檢查此元件是否包含 `NG_VALUE_ACCESSOR` 的設定，若有，則將此元件視為一個表單控制項。

而使用 `forwardRef(() => MyControlComponent)` 的 `forwardRef()` 有快轉的意思，由於我們不確定 `MyControlComponent` 會在 `MY_CONTROL_VALUE_ACCESSOR` 之前還是之後執行，因此將所在的程式快轉到 `MyControlComponent` 產生之後，以避免找不到實體的問題。

而 `multi: true` 的設定，代表著 `NG_VALUE_ACCESSOR` 是可以被注入多種不同實體的，代表所有設定 `NG_VALUE_ACCESSOR` 的實體都可以被正確拿到，而不會被後來的覆蓋。

有了這個新建立的 token 之後，只需要在原來元件 `@Component({})` 中的 `providers: []` 注入這個 token 即可

```typescript
@Component({
  selector: 'app-my-control',
  templateUrl: './my-control.component.html',
  styleUrls: ['./my-control.component.css'],
  providers: [MY_CONTROL_VALUE_ACCESSOR]
})
```

{% note info %}

關於元件中的 `provideres: []`，在之後介紹相依注入時會再詳細說明。

{% endnote %}

# 元件實作 ControlValueAccessor

當上一個步驟完成後，Angular 就會將元件視為一個表單控制項了，但元件本身還是需要時做一些方法，才能夠正確的處理相關的資訊，Angular 提供了一個 `ControlValueAccessor` 介面，包含幾個方法：

- `writeValue(obj: any)`：當資料從元件外部被變更時所呼叫的方法
- `registerOnChange(fn: any)`：將一個方法傳入，在元件內呼叫此方法時即代表表單控制項的值有變更
- `registerOnTouched(fn: any)`：類似 `registerOnChange()`，但是是 `touched` 狀態發生時呼叫
- `setDisabledState(isDisabled: boolean)`：當 disabled 狀態變更時會呼叫這個方法

有了這樣的概念後，我們可能會產出像這樣的程式：

```typescript
export class MyControlComponent implements ControlValueAccessor {

  info = {};

  // 用來接收 setDisabledState 的狀態
  disabled = false;

  // 用來接收 registerOnChange 和 onTouched 傳入的方法
  onChange: (value) => {};
  onTouched: () => {};

  // 元件內必須找一個時機觸發 change 方法
  userInfoChange() {
    this.onChange(this.info);
  }
   
  // 以下是 ControlValueAccessor 需實做的方法
  writeValue(obj: any): void {
    this.info = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
```

透過這樣的實作，整個表單控制項的程式就大功告成啦！

此時我們可以這樣使用這個表單控制項元件：

```html
<app-my-control [(ngModel)]="userInfo" (ngModelChange)="log($event)"></app-my-control>
{{ userInfo | json }}
```

如果打開開發人員工具，還能看到當資料變更時 Angular 替我們加入的 `ng-dirty` 屬性，儼然就是個表單控制項啊！

{% asset_img 01.jpg %}

完整程式碼：

https://stackblitz.com/edit/ironman2019-customize-form-control?file=src/app/my-control/my-control.component.ts

# 相關資源

- [NG_VALUE_ACCESSOR](https://angular.io/api/forms/NG_VALUE_ACCESSOR)
- [forwardRef](https://angular.io/api/core/forwardRef)
- [ControlValueAccessor](https://angular.io/api/forms/ControlValueAccessor)
