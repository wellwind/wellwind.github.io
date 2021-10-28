---
title: "[Angular Material完全攻略]打造問卷頁面(5) - Form Field"
date: 2017-12-31 19:48:07
category: "Angular Material完全攻略"
tags:
  - Angular Material
  - Material Design
  - MatFormField
---

前幾天我們介紹了幾個Angular Material常見的文字型表單欄位控制項，如Input、Autocomplete、Datepicker和Select。這些控制項在Angular 有一些特點，就是它們都會使用一個`<mat-form-field>`元件包起來，這個元件到底是有什麼能耐，讓這些表單欄位都離不開它呢？就讓我們繼續看下去吧！

<!-- more -->

## 簡介Angular Material的Form Field

`<mat-form-field>`被用來包住幾個常見的文字欄位，並根據[「Material Design中的text fields設計指南」](https://material.io/guidelines/components/text-fields.html#)來提這些欄位加上如底線、label和提示訊息等功能能，並符合Material Design中的建議，讓我們不需要重新造輪子，就能用一致的顯示方式來打造我們的介面！

下面幾種功能在設計上都能夠搭配`<mat-form-field>`使用

*   `<input matInput>`和`<textarea matInput>`
*   `<mat-select>`
*   `<mat-chip-list>`：我們會在未來的文章中繼續介紹

接下來我們所提到的每個form field的功能，在以上3種狀況下，都可以使用。

## Form Field功能介紹

要使用`<mat-form-field>`必須加入MatFormFieldModule，在之前的文章我們也應該都已經加入了！

### 設定float label

在Material Design中針對這些輸入型的欄位有個很特殊的設計，稱之為**floating label**，也就是我們常用的label位置可以放在input裡面，像是placeholder一樣，如下圖：

{% asset_img 01-label-resting.png %}

當元件被focus的時候，**這個label會自動浮到上面去**，如下

{% asset_img 02-label-floating.png %}

也因此在Angular Material中，我們不需要特別去加一個`<label>`，直接設定`placeholder`屬性即可，它同時就兼具了placeholder和label的作用，非常的方便。

這個效果相信看過之前的文章應該已經非常清楚了，而這個效果其實是可以自己設定的，我們可以透過設定`floatLabel`，來決定這個label的顯示模式，目前有以下幾種：

-   **auto**：預設值，當focus時，label會自動自動往上浮起來變成label的角色。
-   **always**：代表永遠都是浮起來的狀態，這時候可以直接將它視為一個單純的label存在。
-   **never**：代表永遠不要浮起來，這時候可以把它直接當作一個單純的placeholder。

我們可以修改一下之前問卷調查的程式，隨意找幾個由`<mat-form-field>`包起來的元件做設定，例如：

```html
<mat-form-field floatLabel="always">
  <input name="name" matInput placeholder="姓名" formControlName="name" required>
</mat-form-field>
<mat-form-field floatLabel="never">
  <input type="text" name="nickname" matInput placeholder="暱稱" />
</mat-form-field> 
```

結果如下：

{% asset_img 03-set-float-label.gif %}

姓名欄位我們設定了`floatLabel="always"`，因此一開始它不會被當作是一個placeholder，而是一直以label的形式存在；而設定了`floatLabel="never"`的暱稱欄位，一開始看起來沒什麼變化，但當focus時，它不會往上浮動變成label的形式，有資料時提示就會自動消失，變成了單純的placeholder的感覺。

#### 設定全域的float label

如果希望所有的`<mat-form-field>`都保持一樣的顯示方式，不需要一個一個元件設定，只需要注入`MAT_LABEL_GLOBAL_OPTIONS`即可，ex：

```typescript
@NgModule({
  providers: [
    {provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: {float: 'always'}}
  ]
})
```

結果如下：

{% asset_img 04-global-float-label.png %}

可以看到除了我們自己有設定`never`的欄位以外，其他沒設定的通通都變成了`always`的模式了！

### 隱藏設定required所顯示的星號(*)

在預設情況，只要我們的表單元件有加上`required`，在顯示文字時都會加上一個星號(*)，這是必填欄位的習慣用法，如果不想要顯示這個星號，可以設定`hideRequiredMarker`屬性。

```html
<mat-form-field floatLabel="always" [hideRequiredMarker]="true">
  <input name="name" matInput placeholder="姓名" formControlName="name" required>
</mat-form-field>
```

結果如下：

原本的姓名欄位旁邊多了一個星號

{% asset_img 05-hide-required-marker-before.png %}

設定後就不會再顯示囉

{% asset_img 06-hide-required-marker-after.png %}

儘管不提示星號，當有invalid狀態時，還是會變成紅色提醒哩

{% asset_img 07-hide-required-marker-invalid.png %}

### 使用mat-placeholder提供更細緻的placeholder

一般來說我們可以直接使用`placeholder`屬性提供文字描述，同時具有label的角色，但畢竟透過`<label>`標籤可以提供更複雜的label顯示，如果希望placeholder也能提供更複雜的樣式，可以改成在`<mat-form-field>`中加入`<mat-placeholder>`這個元件

```html
<mat-form-field floatLabel="always" [hideRequiredMarker]="true">
  <input name="name" matInput placeholder="姓名" formControlName="name" required>
  <mat-placeholder>
    <mat-icon>person</mat-icon>請輸入您的姓名</mat-placeholder>
</mat-form-field>
```

看看結果：

{% asset_img 08-wrong-mat-placeholder-1.png %}

這時候的畫面好像怪怪的，姓名這兩個字重複出現了，這是因為`placeholder`和`<mat-placeholder>`同時出現的關係，這時候我們還能再開發人員工具中看到以下錯誤詢息：

{% asset_img 09-wrong-mat-placeholder-2.png %}

提醒了我們`placeholder`和`<mat-placeholder>`不應該同時出現，雖然看起來還是都會顯示，但也不能保證就一定會正常，還是先把`placeholder`拿掉保留`<mat-placeholder>`就好吧！

```html
<mat-form-field floatLabel="always" [hideRequiredMarker]="true">
  <input name="name" matInput placeholder="姓名" formControlName="name" required>
  <mat-placeholder>
    <mat-icon>person</mat-icon>請輸入您的姓名</mat-placeholder>
</mat-form-field>
```

這時候就正常多啦！

{% asset_img 10-correct-mat-placeholder.png %}

我們也能把floatLabel設回`auto`看看在placeholder的模式下是否也能正常顯示：

```html
<mat-form-field floatLabel="auto" [hideRequiredMarker]="true">
  <input name="name" matInput placeholder="姓名" formControlName="name" required>
  <mat-placeholder>
    <mat-icon>person</mat-icon>請輸入您的姓名
  </mat-placeholder>
</mat-form-field>
```

結果如下：

{% asset_img 11-correct-mat-placeholder-and-auto-float.png %}

看來`<mat-placeholder>`在任何情況下都能夠正確顯示哩！

### 使用hintLabel屬性或mat-hint設定提醒文字

在之前介紹`matInput`的時候，我們已經用過`<mat-hint>`了，透過`<mat-hint>`我們可以為元件提供基礎的說明文字，我們也能夠直接設定`<mat-form-field>`的`hintLabel`達到同樣的效果，不過`hintLabel`比較適合用在單純的文字顯示上，而`<mat-hint>`則可以做更複雜的顯示。

除此之外`<mat-hint>`還可以設定`align`屬性，透過設定為`start`或`end`來決定對齊的方向，而`hintLabel`則無法設定`align`，只會出現在`start`的位置

範例程式如下：

```html
<mat-form-field ... hintLabel="最多輸入5個字">
  <input name="name" matInput formControlName="name" maxlength="5" required>
  ...
  <mat-hint align="end">
    已輸入： {{ surveyForm.get('basicQuestions')?.get('name')?.value?.length || 0 }} / 5
  </mat-hint>
</mat-form-field>
```

結果如下：

{% asset_img 12-mat-hint.gif %}

是不是沒花多少程式碼，就完成一堆常用的功能啦！

{% note info %}

**溫馨提醒**：`align`不能重複，否則會產生錯誤訊息，雖然目前看起來還是會顯示只是排版可能會亂掉，但還是盡量避免囉。

{% asset_img 12-mat-hint-error.png %}

{% endnote %}

### 使用mat-error提示錯誤訊息

在之前的input篇我們也介紹過了，可以使用`<mat-error>`來提示錯誤訊息，這個`<mat-error>`只有在`<mat-form-field>`發生錯誤時才會顯示，因此在簡單的情境下我們可以少寫一些`ngIf`或`ngSwitch`：

```html
<mat-form-field>
  <input name="name" matInput required>
  ...
  <mat-error>姓名欄位有錯誤</mat-error>
</mat-form-field>
```

{% asset_img 13-mat-error.png %}

當然比較複雜例如需要依照條件顯示不同錯誤提示的時候，還是一樣需要搭配`ngIf`或`ngSwitch`來顯示。

### 使用color改變整個mat-form-field的focus顏色

之前我們也提過，Angular Material中特別定義了`primary`、`accent`和`warn`，而大多數的Angular Material元件都可以直接透過`color="xxx"`的方式，來改變顏色，`<mat-form-field>`當然也不例外

```html
<mat-form-field floatLabel="never" color="accent">
  <input type="text" name="nickname" matInput placeholder="暱稱" />
</mat-form-field>
```

結果如下：

{% asset_img 14-mat-form-field-color.png %}

當暱稱欄位被focus，原本預設應該顯示`primary`的顏色，但因為我們設定了`color="accent"`的關係，就變成另一種顏色囉。

### 設定prefix和suffix

最後我們再來看一個表單中常用的功能，**在輸入控制項前後加上icon圖示**；我們可以透過`matPrefix`和`matSuffix`，把元素放到輸入控制項的前面或後面，如下

```html
<mat-form-field>
  <input type="number" matInput placeholder="請問您的平均日常消費？">
  <mat-icon matPrefix>attach_money</mat-icon>
  <span matSuffix>新台幣</span>
</mat-form-field>
```

結果如下：

{% asset_img 15-prefix-suffix.png %}

不管是mat-icon還是什麼都好，只要加入`matPrefix`或`matSuffix`，就會幫你放到對的位置，真的是很方便啊！

### 小提示

在`<mat-form-field>`中，至少需要加入一個`MatFormFieldControl`，也就是`<mat-form-field>`所能支援的控制項，否則會出現錯誤訊息：

```
Error: mat-form-field must contain a MatFormFieldControl
```

## 本日小結

今天我們介紹了`<mat-form-field>`這個component，也總算解了之前介紹input等相關原件事為何一定要加上`<mat-form-field>`的迷惑，原來`<mat-form-field>`具有這麼多細緻的功能，讓我們的能用更加一致的方式，為我們的表單添加上更多的變化，實在是**居家旅行 ~~殺人滅口~~ 必備良藥**啊XD！

問卷調查篇預計還有兩篇，再介紹4個元件就會結束了，到時候我們就能把所有**表單相關的控制項(FormControl)**全部掌握，要設計各種Material Design風格的表單也會越來越輕鬆囉！

本日的程式碼GitHub：https://github.com/wellwind/it-ironman-demo-angular-material/tree/day-13-form-field

分支：day-13-form-field

## 相關資源

-   [Material Design - Text Fields](https://material.io/guidelines/components/text-fields.html)
-   [Angular Material - Form Field](https://material.angular.io/components/form-field/overview)
