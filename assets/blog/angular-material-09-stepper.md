---
title: "[Angular Material 完全攻略]打造問卷頁面(1) - Stepper"
date: 2017-12-27 20:04:48
category: "Angular Material 完全攻略"
tags:
  - Angular Material
  - Material Design
  - MatStepper
---

昨天我們已經完成了一個基本的後台版型，今天開始我們要使用Angular Material來製作一個問卷調查的頁面，這個練習主要會學到**所有Angular Material的表單元件**，畢竟在前端的世界各式各樣的表單是必須面臨到的一大議題！不過在介紹表單元件之前，我們先來介紹一個還蠻適合放在問卷頁面的元件－Stepper。

<!-- more -->

## 關於Material Design中的Stepper

在[Material Design的Stepper設計指南](https://material.io/guidelines/components/steppers.html#)中，Stepper可以說是**操作群組化**的結果，我們可以將這些操作分成不同的群組，並且依照順序變成幾個進度，使用者可以依循這些進度完成所有步驟。

在許多元件的設計上，這也稱作**精靈(Wizard)**，不管怎麼稱呼，這類元件的目標很簡單，就是**引導使用者完成所有步驟，並得到完成步驟後的結果**。因此像是<u>註冊頁面、問卷調查</u>等等，都很適合使用這樣的元件來設計，避免因為太多過程而混淆。

Stepper也有許多不同的呈現模式，我們可以依照需要的不同來決定選擇使用什麼樣的模式，例如是否允許回去編輯上一步驟，或是否一定要依循畫面上的步驟去操作等等，都是設計上需要仔細考量的點。

## 開始使用Angular Material的Stepper元件

要使用Stepper元件，首先要先加入`MatStepperModule`。

### 使用mat-stepper

Stepper基本上是一個水平或垂直的component與一系列的step的組合，先來一個水平的Stepper看看：

```html
<mat-horizontal-stepper>
  <mat-step label="個人資訊">
    <h4>提供個人資訊</h4>
  </mat-step>
  <mat-step label="詳細問題">
    <h4>主要的問題內容</h4>
  </mat-step>
  <mat-step label="其他">
    <h4>其他問題</h4>
  </mat-step>
</mat-horizontal-stepper>
```

在上述程式中，我們使用`<mat-horizontal-stepper>`作為一個水平stepper的容器，接著每個步驟都以一個`<mat-step>`包裝起來，對於每個步驟的基本標題文字則使用`<mat-step>`的`label`屬性。

成果如下：

{% asset_img 01-mat-horizontal-stepper.gif %}

各式各樣的特效真是百看不厭啊！

這個元件一樣是可以透過方向鍵、Tab和Enter鍵來互動的，有興趣的讀者可以玩玩看！

### 改變Stepper排列方向

如果希望改為垂直排列，只需要將最外面的`mat-horizontal-stepper`改為`mat-vertical-stepper`即可，效果如下：

{% asset_img 02-mat-vertical-stepper.gif %}

### 設定複雜的label

如果顯示的label想要以比較複雜的方式呈現，可以再`<mat-step>`裡面加上一個帶有 `matStepLabel` directive的`<ng-template>`元素，如下：

```html
<mat-vertical-stepper>
  <mat-step>
    <ng-template matStepLabel>
      <u>個人資訊</u>
    </ng-template>
    <h4>提供個人資訊</h4>
  </mat-step>
  <mat-step>
    <ng-template matStepLabel>
      <em>詳細問題</em>
    </ng-template>
    <h4>主要的問題內容</h4>
  </mat-step>
  <mat-step label="其他">
    <h4>其他問題</h4>
  </mat-step>
</mat-vertical-stepper>
```

結果如下：

{% asset_img 03-mat-step-label.png %}

### 加上「上一步」和「下一步」的按鈕

我們可以在`<mat-step>`中使用按鈕並透過`matStepperNext`和`matStepperPrevious`來動態切換不同的步驟，如下：

```html
<mat-vertical-stepper>
  <mat-step>
    <ng-template matStepLabel>
      <u>個人資訊</u>
    </ng-template>
    <h4>提供個人資訊</h4>
    <button mat-button matStepperNext>前進到「詳細問題」</button>
  </mat-step>
  <mat-step>
    <ng-template matStepLabel>
      <em>詳細問題</em>
    </ng-template>
    <h4>主要的問題內容</h4>
    <button mat-button matStepperPrevious>回到「個人資訊」</button>
    <button mat-button matStepperNext>前進到「其他」</button>
  </mat-step>
  <mat-step label="其他">
    <h4>其他問題</h4>
    <button mat-button matStepperPrevious>回到「詳細問題」</button>
  </mat-step>
</mat-vertical-stepper>
```

結果如下：

{% asset_img 04-mat-step-button.gif %}

### 設定Linear Stepper

Stepper有一個`linear`屬性可以設定，這個屬性設定後，如果step內的表單是`invalid`的話，就會無法前進到下一步，這個設定比較複雜，且必須搭配表單驗證(form validation)來處理，讓我們先看code，再來解釋內容：

我們使用ReactiveForm，首先在component.ts中加入一個可以用來切換linear狀態的變數，以及一個`FormGroup`：

```Typescript
export class SurveyComponent {
  isLinear: boolean;

  basicFormGroup: FormGroup;
  constructor() {
    this.basicFormGroup = new FormGroup({
      name: new FormControl('', Validators.required)
    });
  }
}
```

接著在頁面上加入切換狀態的功能，以及把`FormGroup`套用在第一個step的表單內：

```html
<button mat-button (click)="isLinear = !isLinear">切換Linear狀態</button>
<mat-vertical-stepper [linear]="isLinear">
  <mat-step [stepControl]="basicFormGroup">
    <form [formGroup]="basicFormGroup">
      <ng-template matStepLabel>
        <u>個人資訊</u>
      </ng-template>
      <h4>提供個人資訊</h4>
      <mat-form-field>
        <input name="name" matInput placeholder="姓名" formControlName="name" required>
      </mat-form-field>
    </form>
    <button mat-button matStepperNext>前進到「詳細問題」</button>
  </mat-step>
  <mat-step>
    ...
  </mat-step>
  <mat-step label="其他">
    ...
  </mat-step>
</mat-vertical-stepper>
```

在這裡我們偷偷使用了`<mat-form-field>` 和 `matInput`，這是明天會介紹到的元件，為了要展示表單與Linear Stepper的關係先偷偷拿來使用，要記得加入`MatFormFieldModule`和`MatInputModule`才能開始使用。

另外別忘記我們使用了ReactiveForm，因此也要記得加入`ReactiveFormsModule`。

而在上面的程式碼中，我們先在`<mat-step>`中設定`stepControl`這個設定是用來**讓整個step知道要以哪個form group的valid狀態來決定是否可以進到下一步**，接著裡面就只是一般ReactiveForm的設計了。

成果如下：

{% asset_img 05-linear-step.gif %}

### 只用單一個表單包含所有Step的狀態

剛剛我們用一個`<mat-step>`對一個表單的方式，如果不喜歡這樣的設計，我們依然可以使用一個大的表單包住所有Step的方式來設計，只需要同時設計一個大的巢狀`FormGroup`即可，讓我們先來看看component.ts的內容：

```typescript
export class SurveyComponent implements OnInit {
  isLinear: boolean;

  surveyForm: FormGroup;
  constructor() {
    this.surveyForm = new FormGroup({
      basicQuestions: new FormGroup({
        name: new FormControl('', Validators.required)
      })
    });
  }
}
```

接著畫面修改為：

```html
<form [formGroup]="surveyForm">
  <mat-vertical-stepper [linear]="isLinear">
    <mat-step formGroupName="basicQuestions" [stepControl]="surveyForm.get('basicQuestions')">
      <ng-template matStepLabel>
        <u>個人資訊</u>
      </ng-template>
      <h4>提供個人資訊</h4>
      <mat-form-field>
        <input name="name" matInput placeholder="姓名" formControlName="name" required>
      </mat-form-field>
      <div>
        <button mat-button matStepperNext>前進到「詳細問題」</button>
      </div>
    </mat-step>
    <mat-step>
      ...
    </mat-step>
    <mat-step label="其他">
      ...
    </mat-step>
  </mat-vertical-stepper>
</form>
```

這邊我們直接在最外面用一個form包起來並指定主要的FormGroup，接著在`<mat-step>`中指定內部的`formGroupName`，及`stepControl`，如此一來就可以用一個大的model涵蓋所有step的內容啦！

### 設定optional step

如果某個step不是必要的，我們可以在`<mat-step>`中設定`optinoal`屬性，設定了這個屬性後，會在這個step的label下出現一個灰色的optional提示，不過如果有設定`linear`屬性的話，只要裡面的form group是invalid的，依然會無法直接跳到下一步(畢竟optional只是參考用的)。

程式碼如下：

```html
<mat-step formGroupName="basicQuestions" [stepControl]="surveyForm.get('basicQuestions')" optional>
```

結果：

{% asset_img 06-optional-step.gif %}

### 設定editable step

預設下，每個step都是可以被編輯的狀態，不過若是希望這個狀態**不可以利用「上一步」切回來編輯**，可以設定`editable="false"`。例如：

```html
  <mat-vertical-stepper [linear]="isLinear">
    <mat-step formGroupName="basicQuestions" [stepControl]="surveyForm.get('basicQuestions')" optional>
      <ng-template matStepLabel>
        <u>個人資訊</u>
      </ng-template>
      <h4>提供個人資訊</h4>
      <mat-form-field>
        <input name="name" matInput placeholder="姓名" formControlName="name" required>
      </mat-form-field>
      <div>
        <button mat-button matStepperNext>前進到「詳細問題」</button>
      </div>
    </mat-step>
    <!-- 這個step無法被切回來 -->
    <mat-step editable="false">
      <ng-template matStepLabel>
        <em>詳細問題</em>
      </ng-template>
      <h4>主要的問題內容</h4>
      <button mat-button matStepperPrevious>回到「個人資訊」</button>
      <button mat-button matStepperNext>前進到「其他」</button>
    </mat-step>
    <mat-step label="其他">
      <h4>其他問題</h4>
      <button mat-button matStepperPrevious>回到「詳細問題」</button>
    </mat-step>
  </mat-vertical-stepper>
```

結果如下：

{% asset_img 07-editable-step.gif %}

可以看到切到第3步驟時，按上一步的按鈕就無法再切回去了！

### 自訂optional label文字內容

當`<mat-step>`加上`optional`屬性後，會顯示一個灰色的英文`optional`文字標籤，不過Angular Material的**高品質**承諾包含了所有的元件如果有文字內容，都應該要可以被更改的成符合的語系內容，因此這個`optional`文字內容當然也可以調整，Angular Material使用`MatStepperIntl`來設定optional文字內容，其中的`optionalLabel`就是用來設定顯示文字的，所以我們可自訂一個一樣的class，然後在Angular Material的DI系統中取代原來的`MatStepperIntl`：

```typescript
export class TwStepperIntl extends MatStepperIntl {
  optionalLabel = '非必填';
}

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css'],
  providers: [{ provide: MatStepperIntl, useClass: TwStepperIntl }]
})
export class SurveyComponent implements OnInit { ... }
```

這裡我們只針對SurveyComponent的Stepper去設定，如果希望能在所有元件使用到Stepper都用到的話，可以加在更外層的Ｍodule中。

結果如下：

{% asset_img 08-custom-optional-label.png %}

如我們預期，文字內容就整個被改變啦！

## 本日小結

今天我們介紹了Angular Material中的Stepper，完成一個簡單的精靈效果，這個元件在很多複雜的表單中都有機會使用到，Angular Material針對Stepper提供了很多可以調整的細節，讓步驟的變化能夠更細膩！

有了基本的精靈功能之後，明天開始我們就會一步一步把所有基本Angular Material的表單元件都填入這些步驟裡面，好完成一個簡單的問卷系統啦！

本日的程式碼GitHub：https://github.com/wellwind/it-ironman-demo-angular-material/tree/day-09-stepper

分支：day-09-stepper


## 相關資源

-   [Material Design - Steppers](https://material.io/guidelines/components/steppers.html#)
-   [Angular Material - Stepper](https://material.angular.io/components/stepper/overview)
