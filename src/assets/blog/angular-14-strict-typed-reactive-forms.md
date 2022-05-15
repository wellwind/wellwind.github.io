---
title: "搶先體驗強型別表單（Strict Typed Reactive Forms）"
date: 2022-05-15 12:09:06
category:
  - "Angular 大師之路"
tags:
  - "Angular"
  - "Angular 14"
  - "Strict Typed Reactive Forms"
ogImage: 01.png
---

Angular 14 即將推出強型別的 Reactive Forms 表單功能，讓我們在開發過程中可以享受強型別定義帶來的好處，不用再擔心弱型別不小心打錯字等等問題，今天就來看一下如何使用強型別的表單功能！

<!-- more -->

# 資料型別與表單定義

假設我們實際上的模型型別為：

```typescript
export interface Person {
  name: string;
  address: {
    zip: string;
  };
  interest: { name: string }[];
}
```

過去我們會定義出這樣的表單模型：

```typescript
const form = new FormGroup({
  name: new FormControl('Mike'),
  address: new FormGroup({
    zip: new FormControl('111')
  }),
  interest: new FormArray([
    new FormGroup({
      name: new FormControl('Angular')
    })
  ])
});
```

基本上當然是沒什麼問題，不過整個所有屬性都是弱型別的，因此我們無法保證不會打錯字，有了新的強型別表單後，我們可以把表單的模型也定義起來：

```typescript
export interface PersonForm {
  name: FormControl<string | null>;
  address: FormGroup<{ 
    zip: FormControl<string | null>
  }>;
  interest: FormArray<FormGroup<{ name: FormControl<string | null> }>>;
}
```

要特別注意的是，由於 Reactive Forms 的 FormControl 資料都是可以為 null 的，因此在定義 `FormControl` 的時候，除了原本預期的資料型別之外，也要加上 `null` 定義。

接著只要在 `FormControl` 加上這個表單定義就可以啦！

```typescript
const form = new FormGroup<PersonForm>({
  ...
});
```

# 享受強型別帶來的好處

針對表單定義了型別之後，我們在整個 Reactive Forms 的表單操作，都會有強型別的效果！搭配編輯器本身提供的 TypeScript 功能，各種自動完成或是錯誤提示等等，都能夠一清二楚！

## 定義屬性

在指定表單的型別之後，在定義其中的屬性時，相關的屬性會自動提示

{% asset_img 01.png %}

每個屬性的型別也都可以看得到

{% asset_img 02.png %}

巢狀的屬性當然也可以通

{% asset_img 03.png %}

當滑鼠移動到屬性上方時，當然也都會自動提示

{% asset_img 04.png %}

## 取得表單控制項

再過去要取得某個表單欄位資料，有以下寫法

```typescript
this.form.get('address')!.value;
this.form.controls['name'].value
```

用字串取資料，打錯字是非常難控制的，強型別後 `controls` 屬性本身就能夠取得所有的屬性

```typescript
this.form.controls.name.value
```

巢狀的一樣完全沒問題！

```typescript
this.form.controls.address.controls.zip.value
```

編輯器設定正確的話的會自動提示

{% asset_img 05.png %}

取得整個表單資料，一樣會有強型別提示

{% asset_img 07.png %}

有了限制型別的表單，我們就再也不用擔心開發過程中打錯字啦！！

# 其他注意事項與建議

強型別表單當然非常方便，不過還是有需要注意的地方。

## 動態表單

過去我們可以用 `addControl`、`removeControl` 等方式來動態的加入或移除表單元件，不過當設定型別後，會因為屬性都已經確定了，因此會造成加入沒定義好的控制橡實，出現錯誤


```typescript
this.form.addControl(new FormControl(''), 'test');
// 錯誤，因為 test 不在型別定義的屬性之中
```

當然這也是非常合理的事情，需要動態的產生表單，且屬性名稱不能控制時，還是會走回過去弱型別的方式。

當然，如果可以定義好的型別，就儘量先定義好！

## 樣板 formControlName

在 HMTL 中，我們經常會這樣寫來將模型與畫面繫結在一起

```html
<form [formGroup]="form">
  <input formControlName="name" />
</form>
```

`formControlName="name"` 是弱型別的寫法，希望有一天它也能自動提示有哪些屬性可以使用，不過現在還沒辦法，為了充分利用強型別的好處，個人會推薦改用 `controls.xxx` 的方式

```html
<input [formControl]="form.controls.name" />
```

會更加安全，而且一樣可以享有編輯器支援的效果

{% asset_img 06.png %}

## 將資料型別轉成表單模型型別

一般來說，我們會先設計好資料模型的型別，例如

```typescript
export interface Person {
  name: string;
  address: {
    zip: string;
  };
  interest: { name: string }[];
}
```

之後才去設計表單模型的型別，不過基本各個屬性名稱都是對應的，同樣的東西要再寫一遍，只是轉換成 `FormControl` 或 `FormArray` 等，也是蠻麻煩的，於是我嘗試寫了一個 TypeScript 的定義，來幫助我們把基本的資料模型型別轉成表單型別：

```typescript
export type Unpacked<T> = T extends (infer U)[] ? U : T;

export type ToForm<OriginalType> = {
  [key in keyof OriginalType]
    : OriginalType[key] extends Array<any>
      ? FormArray<
        Unpacked<OriginalType[key]> extends object
          ? FormGroup<ToForm<Unpacked<OriginalType[key]>>>
          : FormControl<Unpacked<OriginalType[key]> | null>
        >
      :OriginalType[key] extends object
        ? FormGroup<ToForm<OriginalType[key]>>
        : FormControl<OriginalType[key] | null>
};
```

使用方式很簡單：

```typescript
type PersonForm = ToForm<Person>;

const form = new FormGroup<PersonForm>({ ... });
```

這個定義是初步寫出來的，也還沒經過比較完整的測試，但自己使用起來是沒有遇到什麼問題，如果你有遇到特殊的狀況歡迎跟我說一聲 🙇‍♂️

# 本日小結

不知道從 Angular 的哪個版本開始，強型別限制的表單就一直被提出來希望支援，Angular 團隊也確實有開放討論，最終確定會在 Angular 14 推出了，這可以幫助我們寫出非常安全的表單應用程式，強烈建議未來都盡可能使用強型別表單來開發應用程式啦！

# 相關資源

- [RFC: Strictly Typed Reactive Forms](https://github.com/angular/angular/discussions/44513)
