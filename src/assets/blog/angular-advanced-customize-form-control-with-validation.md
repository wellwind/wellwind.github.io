---
title: "[Angular進階議題] 在客製化表單控制項增加驗證(valid)結果"
date: 2017-09-23 18:28:09
tags:
    - Angular
    - NG_VALIDATORS
    - NG_ASYNC_VALIDATORS
    - Validator
---

在之前的文章「[讓自訂的Component可以使用ngModel的方法](https://wellwind.idv.tw/blog/2017/03/20/angular-advanced-customize-component-with-ngmodel/)」我們提到可以替Component加入NG_VALUE_ACCESSOR及實作ControlValueAccessor，來讓我們的Component成為客製化的表單控制項，並能夠使用`[(ngModel)]`達到two way binding的效果；既然成為了表單控制項，當然就該能享有驗證(Validation)的好處，以及在表單變化時得到一些額外的class支援，讓我們在設計上能夠有彈性！今天就要來如何讓別人在使用我們的表單控制項時能夠及時得知表單的內部驗證狀態(**NG_VALIDATORS和NG_ASYNC_VALIDATORS**)。

<!-- more -->

# 問題描述

以之前實作ControlValueAccessor的例子，我們希望變成如下：

{% asset_img 01.png %}

最上面的整個表單是我們自訂的表單控制項，最下面的按鈕在上面的表單驗證沒有通過(invalid)時，應該是disabled的狀態，直到表單驗證通過(valid)，才可以按下去並顯示訊息。

要達到這個目標有兩個簡單的方法，第一個是直接寫程式碼檢查元件binding的資料內容，第二個是[自己寫一個Custom Validator](https://angular.io/guide/form-validation#custom-validators)去檢查資料，基本上都算是比較基本的作法！

不過我們假設一下這個元件是需要共用且驗證是必要且複雜的，因此我們不希望使用這個元件的其他開發人員(也就是跟你一起工作的同事)自己去寫額外的程式碼，也不要額外使用一個Custom Validator來檢查，我們需要最直接的方法，只要懂得Angular表單驗證基礎的人就可以直接取得控制項是否為valid的方式的實作！

也就是我們的View希望可以看起來像這樣

控制項內容(其他人不用知道細節)：

```html
<div>
  <label for="name">Name:</label>
  <input type="text" name="name" [(ngModel)]="name" [disabled]="disabled" required minlength="4" />
</div>
<div>
  <label for="age">Age:</label>
  <input type="text" name="age" [(ngModel)]="age" [disabled]="disabled" required />
</div>
```

使用時的內容(其他開發人員使用元件的情境)：

```Html
<app-user-profile [disabled]="profileDisabled" [(ngModel)]="user" #profile="ngModel"></app-user-profile> 
<div>
  <button (click)="submit()" [disabled]="profile.invalid">以上欄位必填才可以送出</button>
</div>
```

這是[template driven form檢查資料的用法](https://angular.io/guide/forms#show-and-hide-validation-error-messages)，也就是直接用template reference的方式取得表單控制項的ngModel directive，然後去判斷是否為invalid；不過很可惜，即使裡面的input加上了required、minlength這類的驗證directive，也只能使得內部的input為invalid，卻無法讓整個Component狀態為invalid！

{% asset_img 02.png %}

解決方式就是透過NG_VALIDATORS，來讓我們的控制項元件也能夠有內部validation狀態！

## 使用NG_VALIDATORS

跟使用NG_VALUE_ACCESSOR一樣，我們也可以透過提供**NG_VALIDATORS**的方式，來告訴別人我們這個Component是<u>有提供表單驗證的</u>，首先我們先加入一個**USER_PROFILE_VALIDATORS**

```typescript
export const USER_PROFILE_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => UserProfileComponent),
  multi: true
};
```

接著一樣在Component宣告時加入到providers中，原本已經有一個`USER_PROFILE_VALUE_ACCESSOR`了

```typescript
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  providers: [USER_PROFILE_VALUE_ACCESSOR]
})
```

我們要再加入`USER_PROFILE_VALIDATORS`

```typescript
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  providers: [USER_PROFILE_VALUE_ACCESSOR, USER_PROFILE_VALIDATORS]
})
```

然後在我們的Component中實作[Validator介面](https://angular.io/api/forms/Validator)，其中的validate方法就是用來驗證Component裡面的內容用的，用法與Custom Validator基本上相同：

```typescript
  onValidatorChange: () => void;

  validate(c: AbstractControl): { [key: string]: any; } {
    const value = c.value;
    const requiredError = {
      'error': 'name and age is required'
    };
	// 檢查name與age必填
    return (value && value.name && value.age) ? null : requiredError;
  }

  registerOnValidatorChange?(fn: () => void): void {
    this.onValidatorChange = fn;
  }
```

這時候再回來看看執行結果：

{% asset_img 03.gif %}

<u>每當ControlValueAccessor.registerOnChange註冊的onChange事件被觸發時，同時也會觸發了validate方法，接著檢查onChange傳來的內容</u>；結果就是沒有內容時可以看到`name and age is required`的訊息，當name和age都有資料時，就變成valid的了！

{% note warning %}  

這個執行順序非常重要，因為客製化表單控制項時常常會直接binding一個物件，當資料變化時，物件內容會變化，但不會觸發changes事件，也因此不會觸發validate方法；因此若需要觸發validate方法，記得資料變化時一定要去觸發changes事件！

反過來說當某些資料變化卻不需要進行validate時，我們只需要**不要**觸發changes事件即可，某種程度對效能也會有點幫助。

{% endnote %}  



# 複雜的驗證邏輯時

透過提供**NG_VALIDATORS**和實作Validator的方法，我們可以自己寫程式驗證，不過假設我們需要檢查的邏輯複雜時，就需要在validate裡面寫更多的程式，像目前的Component裡面有一個input宣告內容其實是有minlength限制的：

```html
<input type="text" name="name" [(ngModel)]="name" [disabled]="disabled" required minlength="4" />
```

但我們手動檢查的部分其實只檢查到了`required`的部分，還沒檢查到`minlength=4`的部分，如果還需要加上其他複雜的custom validators時，就會變得越來越麻煩了，這時候我們可以使用template reference的技巧，取得要驗證的控制項NgModel，然後在validate對這NgModel逐個檢查是否錯誤，聽起來很有道理，實際上做起來呢？讓我們繼續看下去。

首先先為我們的input加上template reference

```html
<div>
  <label for="name">Name:</label>
  <input type="text" name="name" [(ngModel)]="name" [disabled]="disabled" #nameField="ngModel" required minlength="4" />
</div>
<div>
  <label for="age">Age:</label>
  <input type="text" name="age" [(ngModel)]="age" [disabled]="disabled" #ageField="ngModel" required />
</div>
```

接著在對應的component.ts檔裡面把nameField和ageField抓進來管理：

```typescript
export class UserProfileComponent implements OnInit, ControlValueAccessor, Validator {
  @ViewChild('nameField') nameField: NgModel;
  @ViewChild('ageField') ageField: NgModel;
  formFields: NgModel[];

  ngOnInit() {
    this.formFields = [];
    this.formFields.push(this.nameField);
    this.formFields.push(this.ageField);
  }
}
```

再來把validate內容改為檢查`formFields`裡面的結果，而不是檢查AbstractControl

```typescript
  validate(c: AbstractControl): { [key: string]: any; } {
    const errors = {};
    this.formFields.forEach(field => {
      if (field && field.invalid) {
        errors[field.name] = field.errors;
      }
    });
    return Object.keys(errors).length ? errors : null;
  }
```

我們把formFields的內容抓出來，檢查它是否為invalid，如果**是**就紀錄errors，最後若有紀錄到任何的errors，就回傳這些錯誤，否則回傳null。

到目前看起來一切很合理，趕快看看執行結果：

先在Name輸入一個字看看

{% asset_img 04.png %}

已經輸入內容的required錯誤竟然沒消失，再多輸入一個字看看

{% asset_img 05.png %}

輸入兩個字了，required消失了，minlength告訴你目前未滿4個字(這是對的)，但目前的長度竟然為1(~~WTF?~~)！

這實在太不合理了，有種**validate結果永遠慢一拍的感覺**；嘗試在validate裡面下個console.log看看

```typescript
    if (!c.value) {
      return;
    }
    console.log('Control => ' + c.value.name);
    console.log('NgModel => ' + this.nameField.value);
    console.log('------');
```

按下F12看看結果

{% asset_img 06.png %}

果然永遠慢一拍，看來當資料change觸發時，會立刻進入validate驗證傳入的資料正確性，然後才會更新NgModel的內容，這也造成了在validate時NgModel永遠不會是最新資料的問題！既然這個change週期NgModel沒更新，那我們只能等資料都更新後的下一個週期再來驗證了！為了確定這個週期會更新資料，我們加上一個setTimeout來看看，下個週期時NgModel資料是否已經被更新了？

```typescript
    setTimeout(() => {
      console.log('Control => ' + c.value.name);
      console.log('NgModel => ' + this.nameField.value);
      console.log('------');
    });
```

{% asset_img 07.png %}

果然，由於資料更新順序的關係validate傳進來的value會在NgModel更新前發生！既然知道問題，就好辦了，既然同步的validate不能用，就拐個彎使用非同步的validate！

## 使用NG_ASYNC_VALIDATORS

由於要setTimeout等待NgModel資料更新的關係，validate()無法立刻傳回錯誤結果，不過還好Angular也支援非同步的validation，因此我們也可以**傳回Promise或Observable的格式，來達成非同步驗證的目標**！

首先先把我們的`USER_PROFILE_VALIDATORS`改成非同步的validator，只要改成**NG_ASYNC_VALIDATORS**就好

```typescript
export const USER_PROFILE_VALIDATORS: any = {
  provide: NG_ASYNC_VALIDATORS,
  useExisting: forwardRef(() => UserProfileComponent),
  multi: true
};
```

再把原來的validate()改成非同步的做法

```typescript
  validate(c: AbstractControl): Observable<{ [key: string]: any; }> {
    // 透過Observable的方式進行非同步validation
    const subject = new Subject();

    // 使用setTimeout，強制下個週期NgModel都更新後再檢查
    setTimeout(() => {
      const errors = {};
      this.formFields.forEach(field => {
        if (field && field.invalid) {
          errors[field.name] = field.errors;
        }
      });
      subject.next(Object.keys(errors).length ? errors : null);
      subject.complete();
    });
    return subject;
  }
```

大功告成！立刻看看結果囉：

{% asset_img 08.gif %}

成果一切如我們預期，不會再有NgModel慢一拍的問題了！接著就能把這個Component拿給別人使用，其他人只要知道整個Component的狀態是valid還是invalid就好，超級方便的啦！！

# 小結

今天我們學到透過提供**NG_VALIDATORS**給Component的方式，為原本已經是表單控制項(提供NG_VALUE_ACCESSOR)的Component加上了內部的驗證機制，在設計共用元件時，我們可以透過這種方式把驗證的邏輯全部封裝到Component裡面，外部的使用Component的其他開發人員只需要知道他的驗證狀態即可，不用自行撰寫程式來驗證狀態(當然我們願意的話還是可以自己寫額外的Validators來增加其他驗證條件)。

另外當控制項裡面驗證邏輯複雜時，我們也可以先為Component內使用的控制項加上validator，最後在validate()裡面一次進行檢查，不過由於資料執行順序的關係，會造成內部的NgModel慢一拍的問題，這時候我們可以改用非同步的驗證方式(儘管非同步的驗證方式本來不是設計來解決這個問題的...)，只需要把原本的**NG_VALIDATORS**改成**NG_ASYNC_VALIDATORS**，再把validate()改為非同步的方式(Promise或Observerable)，再加上一個setTimeout()讓NgModel資料都更新後再來進行驗證的動作。

透過這些技巧，我們可以把複雜但具有共用性的表單拆成數個子表單控制項，並且各自有其驗證功能，最後在檢查每個Component的valid或invalid狀態就可以了，減輕其他開發人員的負擔！

今天程式碼的ＧitHub：https://github.com/wellwind/angular-advanced-topic-demo/tree/master/customize-component-with-validator

{% note info %}  

以上文章的內容適用於所有Angular2以上的版本，不過Angular4以上有加入額外的interface來幫助我們不要把程式寫的太難讀，例如錯誤訊息的格式`{ [key: string]: any; }`可以直接使用ValidationErrors；原本實作Validator的validate是同步方法，要改成非同步可以改為實作`AsyncValidator`，方法會變為

**validate(c: AbstractControl): Promise<ValidationErrors|null>|Observable<ValidationErrors|null>;**

這可以幫助我們閱讀在程式上會更加的清楚喔！

{% endnote %}  

