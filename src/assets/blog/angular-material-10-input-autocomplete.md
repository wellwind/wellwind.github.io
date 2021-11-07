---
title: "[Angular Material 完全攻略]打造問卷頁面(2) - Input、Autocomplete"
date: 2017-12-28 20:10:48
category: "Angular Material 完全攻略"
tags:
  - Angular Material
  - Material Design
  - MatInput
  - MatAutocomplete
---

接下我們要來介紹幾個在Material Design中屬於Input，也就是文字輸入欄位相關的功能，文字輸入也可以說是表單裡面最常使用到的欄位！接下來就來看看Angular Material的Input、Autocomplete！！

<!-- more -->

## Material Design中的文字輸入欄位

在[Material Design的文字欄位設計指南](https://material.io/guidelines/components/text-fields.html#)中，文字欄位就是提供使用者輸入文字的一個空間，通常在表單中最常被使用，當然像是其他一些如搜尋功能等也很會出現，文字欄位必須要能提供驗證使用者輸入的資訊的功能，來幫助使用者修正問題，另外也能提供一些自動完成的功能，以提供使用者相關的建議。

文字欄位可以是單行或是多行，如果需要的話也要提供能隨著行數增加和自動增加的功能。

另外，文字欄位也要能限制輸入的格式，或是提供選項來選擇。

## 開始使用Angular Material的Input

要使用Input相關的功能，首先得先加入`MatInputModule`。另外，部分的表單控制項，都需要搭配另一個元件－FormField來使用，因此我們也要加入`MatFormFieldModule`。關於FormField元件，目前只需要簡單使用就好，細節的操作會在後續的文章做詳細的說明。

### 使用matInput

`matInput`是一個依附於input和text的表單基本元件上的directive，因此我們只需要在input或textarea中加入`matInput`這個directive，即可替元件加上基本的Material Design樣式，不過為了讓input和textarea能更加具有意義，我們會在外面用`<mat-form-field>`包起來，這個`<mat-form-field>`可以替input和textarea等元件加上更有意義的訊息，讓操作上更加容易。

```html
<div>
  <mat-form-field>
    <input type="text" name="nickname" matInput placeholder="暱稱" />
  </mat-form-field>
</div>
<div>
  <mat-form-field>
    <textarea name="intro_self" matInput placeholder="自我介紹"></textarea>
  </mat-form-field>
</div>
```

效果如下：

{% asset_img 01-mat-input-basic.gif %}

可以看到我們的`placeholder`在這邊扮演了`label`的效果，而且預設會直接在輸入框裡面(就跟一般的placeholder一樣)，但是當focus到裡面時，placeholder的內容就往上浮動成了一個label。

### matInput支援的input type

由於`matInput`只是個directive，使用上是直接加到相關的input或textarea元素中，因此我們依然可以使用所有已知的input或textarea的屬性，來設定我們的輸入欄位。

也因此，瀏覽器原生的input type基本上也都支援，例如：

-   date
-   datetime-local
-   email
-   month
-   number
-   password
-   search
-   tel
-   text
-   time
-   url
-   week

舉例來說，我們可以使用`<input type="date" …/>`，來產生一個輸入日期的文字欄位：

```html
<mat-form-field>
  <input type="date" name="birthday" matInput placeholder="生日" />
</mat-form-field>
```

結果如下：

{% asset_img 02-mat-input-type-date.png %}

如此即可為input加入日期選擇的功能，如圖這是Macbook的Google Chrome上顯示的結果，但實際結果可能會因為作業系統和瀏覽器的不同而不同，有些瀏覽器可能甚至不支援這樣的功能，這在現代的網頁設計上是一個稍微扣分的部分，也就是在**不同瀏覽器呈現效果可能會有極大差異的問題**；不過若是設計出來的網頁能確定在某個系統和瀏覽器上顯示，這也不失為一種簡單有效的做法！

{% note info %}

關於範例中的日期選擇功能，在Angular Material中有一個強大且持續在進步的Datepicker元件，明天會仔細介紹。

{% endnote %}

### 使用mat-hint加上提示說明

有時候單是使用placeholder屬性可能會無法說明欄位的意義，這時候我們可以使用`<mat-hint>`替欄位加上比較仔細地說明，例如：

```html
<mat-form-field>
  <textarea name="intro_self" matInput placeholder="自我介紹"></textarea>
  <mat-hint>簡單介紹一下你的興趣吧！</mat-hint>
</mat-form-field>
```

成果如下：

{% asset_img 03-mat-hint.png %}

### 使用mat-error加上錯誤訊息提示

當文字欄位資料有問題時，需要提示錯誤訊息是很常見的事情，關於這點我們可以用`<mat-error>`來顯示錯誤的訊息，程式如下：

```html
<mat-form-field>
  <textarea name="intro_self" matInput placeholder="自我介紹" required></textarea>
  <mat-hint>簡單介紹一下你的興趣吧！</mat-hint>
  <mat-error>請記得輸入自我介紹喔！</mat-error>
</mat-form-field>
```

結果如下：

{% asset_img 04-mat-error.gif %}

只要同一個`<mat-form-field>`區間裡面的輸入欄位有錯誤，這個錯誤訊息就會跳出來。

假如我們希望針對不同的錯誤跳出不同的訊息，只需要使用`ngIf`或`ngSwitch`來依照錯誤類型來決定顯示與否即可：

```html
<mat-form-field>
  <textarea name="intro_self" matInput placeholder="自我介紹" formControlName="intro" required></textarea>
  <mat-hint>簡單介紹一下你的興趣吧！</mat-hint>
  <mat-error *ngIf="surveyForm.get('basicQuestions').get('intro').hasError('required')">請記得輸入自我介紹喔！</mat-error>
  <mat-error *ngIf="surveyForm.get('basicQuestions').get('intro').hasError('minlength')">至少輸入10個字吧！</mat-error>
</mat-form-field>
```

結果如下：

{% asset_img 05-mat-error-with-ngif.gif %}

### 自己控制錯誤顯示的時機

預設情境下，**錯誤顯示的時機必須符合dirty、touched和invalid的狀態，才會顯示錯誤訊息**，因此以剛剛的狀況來說，我們在一開始輸入文字時，由於符合dirty和invalid的狀態，但是因為第一次進入不會是touched狀態，因此一開始不會立刻顯示錯誤訊息，而是在離開欄位後，狀態也變更為touched後，才會顯示錯誤。

如果希望自己決定錯誤顯示的時機，可以實作`ErrorStateMatcher`這個介面的`isErrorState`方法，來決定何時該顯示，為傳true代表要顯示錯誤；並在input的`errorStateMatcher`(加上`matInput`後擴充的功能)指定我們自訂的matcher即可，實際來寫點程式看看吧，我們先在component.ts實作這個matcher

```typescript
// 調整時機為invalid + dirty即顯示錯誤訊息
export class EarlyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && control.dirty);
  }
}
export class SurveyComponent {
  surveyForm: FormGroup;
  earlyErrorStateMatcher = new EarlyErrorStateMatcher();
}
```

接著在input中加入這個matcher

```html
<mat-form-field>
  <textarea name="intro_self" matInput placeholder="自我介紹" formControlName="intro" required [errorStateMatcher]="earlyErrorStateMatcher"></textarea>
  <mat-hint>簡單介紹一下你的興趣吧！</mat-hint>
  <mat-error *ngIf="surveyForm.get('basicQuestions').get('intro').hasError('required')">請記得輸入自我介紹喔！</mat-error>
  <mat-error *ngIf="surveyForm.get('basicQuestions').get('intro').hasError('minlength')">至少輸入10個字吧！</mat-error>
</mat-form-field>
```

結果如下：

當我們一進入文字欄位並輸入內容時，立即符合了我們自訂的matcher規則，所以不用等到移出焦點後變成touched狀態，就會提早顯示錯誤啦！

{% asset_img 06-custom-error-state-macher.gif %}

如果要在全域的範圍套用這個規則，可以在providers中注入這個matcher

```typescript
providers: [
  {provide: ErrorStateMatcher, useClass: EarlyErrorStateMatcher}
]
```

就能夠為注入範圍內的輸入欄位套上規則囉。

### 使用matTextareaAutosize自動調整大小的textarea

我們可以為textarea加上自動調整大小功能，只需要加入`matTextareaAutosize`這個directive即可：

```html
<textarea name="intro_self" matInput placeholder="自我介紹" formControlName="intro" required matTextareaAutosize></textarea>
```

結果如下：

當我們文字超過原本textarea的高度時，就會開始自動放大，當文字減少時，就會自動縮小，很有趣吧！

{% asset_img 07-autosize-textarea.gif %}

## 開始使用Angular Material的Autocomplete

要使用Input的Autoomplete相關功能，首先得先加入`MatAutocompleteModule`。

### 使用mat-autocomplete

接下來我們來學習使用Autocomplete的功能，在這邊我們希望能完成一個「國家」的輸入欄位，並且能夠依照輸入的內容選擇自動完成的清單，大致畫面如下：

{% asset_img 08-autocomplete-sample.png %}

從畫面上來看，我們需要兩樣東西，一個是單純的文字輸入欄位，另一個是可以選擇的國家清單；文字輸入欄位我們已經會了，就是一個簡單的input：

```html
<mat-form-field>
  <input type="text" name="country" matInput placeholder="國家" formControlName="country" />
</mat-form-field>
```

而autocomplete的清單，我們可以使用`<mat-autocomplete>`以及`<mat-option>`的組合來建立這組清單：

```html
<mat-autocomplete>
  <mat-option *ngFor="let country of countries$ | async" [value]="country.name">
    {{ country.name }}
  </mat-option>
</mat-autocomplete>
```

國家的json檔資料來源：https://gist.github.com/keeguon/2310008

我們把這個清單存到`asset/countries.json`中，然後在component直接使用`HttpClient`抓取這個清單的資料：

```javascript
ngOnInit() {
  this.countries$ = this.httpClient.get<any[]>('assets/countries.json');
}
```

這時候畫面上還不會看到任何資料，因為我們的input還不知道要顯示autocomplete的來源在哪裡，我們可以在input中設定`matAutocomplete`屬性，指定autocomplete的來源，整個段畫面程式碼看起來如下：

```html
<mat-form-field>
  <input type="text" name="country" matInput placeholder="國家" formControlName="country" [matAutocomplete]="countries" />
</mat-form-field>

<mat-autocomplete #countries="matAutocomplete">
  <mat-option *ngFor="let country of countries$ | async" [value]="country.name">
    {{ country.name }}
  </mat-option>
</mat-autocomplete>
```

接著再回到畫面上點選國家輸入欄位，就能選擇國家的清單啦！

{% asset_img 09-basic-autocomplete-demo.gif %}

我們可以透過方向上下鍵來移動選單，然後按下Enter選擇想要的國家。

### 過濾資料來源

我們已經有了一個autocomplete的清單，但這樣還不太夠，我們可能會希望過濾已經輸入的內容，避免從冗長的清單中選取，由於我們目前使用的是ReactiveForm，因此我們可以使用`valueChanges`，在資料變更時重新篩選要列出的清單：

```typescript
  ngOnInit() {
    this.surveyForm
      .get('basicQuestions')
      .get('country')
      .valueChanges.debounceTime(300)
      .subscribe(inputCountry => {
        this.countries$ = this.httpClient.get<any[]>('assets/countries.json').map(countries => {
          return countries.filter(country => country.name.indexOf(inputCountry) >= 0);
        });
      });
  }
```

另外，我們也可以把已經過濾的資料內容做一點修飾，依照我們輸入的內容變成粗體顯示，這邊先加入一個

```typescript
  highlightFiltered(countryName: string) {
    const inputCountry = this.surveyForm.get('basicQuestions').get('country').value;
    return countryName.replace(inputCountry, `<span class="autocomplete-highlight">${inputCountry}</span>`);
  }
```

接著在style.css中加入這個樣式：

```css
.autocomplete-highlight {
  font-weight: bold;
  background: yellow;
}
```

最後把畫面稍微做個調整：

```html
<mat-autocomplete #countries="matAutocomplete">
  <mat-option *ngFor="let country of countries$ | async" [value]="country.name">
    <span [innerHTML]="highlightFiltered(country.name)"></span>
  </mat-option>
</mat-autocomplete>
```

再來看看結果：

{% asset_img 10-filtered-autocomplete.gif %}

可以看到清單依據我們輸入的內容自動篩選出符合的項目，而且還有highlight提示，是不是很好玩啊！

### 透過displayWith決定最終顯示內容

我們可以透過設定`<mat-autocomplete>`的`displayWith`屬性來指定一個function，這個function可以改變要顯示的內容：

```html
<mat-autocomplete #countries="matAutocomplete" [displayWith]="displayCountry">
  <mat-option *ngFor="let country of countries$ | async" [value]="country">
    <span [innerHTML]="highlightFiltered(country.name)"></span>
  </mat-option>
</mat-autocomplete>
```

這裡我們把原來的`[value]`改為傳入整個country物件，好讓`displayWith`指定的function可以透過選擇的物件決定文字呈現的內容：

```typescript
displayCountry(country: any) {
  if (country) {
    return `${country.name} / ${country.code}`;
  } else {
    return '';
  }
}
```

成果如下：

{% asset_img 11-display-with.gif %}

可以看到在選擇完國家後，透過`displayWith`，我們自動為選擇的內容加上了國家的編碼。

### 使用mat-optgroup顯示群組資料

`<mat-option>`既然是清單型的選項資料，有個`<mat-optgroup>`作為群組好像也是很合理的一件事情，Angular Material也替我們想好了，要使用一點都不難，跟在設計select的optgroup大同小異，假設我們有一組資料如下：

```typescript
this.majorTechList = [
  {
    name: '前端',
    items: ['HTML', 'CSS', 'JavaScript']
  },
  {
    name: '後端',
    items: ['C#', 'NodeJs', 'Go']
  }

```

在畫面上我們可以透過`mat-optgroup`來顯示這些群組：

```html
<mat-form-field>
  <input type="text" name="majorTech" matInput placeholder="代表技術" formControlName="majorTech" [matAutocomplete]="majorTechs" />
</mat-form-field>

<mat-autocomplete #majorTechs="matAutocomplete">
  <mat-optgroup *ngFor="let techList of majorTechList" [label]="techList.name">
    <mat-option *ngFor="let tech of techList.items" [value]="tech">
      {{ tech }}
    </mat-option>
  </mat-optgroup>
</mat-autocomplete>
```

再來看看結果：

{% asset_img 12-mat-optgroup.gif %}

連這種細節都想好了，真不愧是高品質的Angular Material啊！

## 本日小結

今天我們介紹了兩個輸入欄位的功能，Input與Autocomplete。

Input賦予一般的文字輸入欄位新的活力！搭配MatFormField在顯示資訊上也非常清楚，另外Angular Material也讓我們對於錯誤訊息的提示時機能夠有很靈活的機會去調整，可以說是非常的方便。

Autocomplete其實只是Input的延伸，但加上了一個mat-autocomplete元件，來讓Input輸入時能有個參考依據，Autocomplete是前端非常經典的功能，Angular Material也為這個功能做了很好的詮釋，使用上也非常好上手！

文字欄位的元件其實還有一個很常用的功能，就是選擇日期的功能－Datepicker，Datepicker有不少東西可以介紹，就留到明天再來聊吧！

本日的程式碼GitHub

## 相關資源

-   [Material Design - Text Fields](https://material.io/guidelines/components/text-fields.html#)
-   [Angular Material - Input](https://material.angular.io/components/input/overview)
-   [Angular Material - Autocomplete](https://material.angular.io/components/autocomplete/overview)
