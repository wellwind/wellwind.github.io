---
title: "[前端軍火庫]ClockPicker - 更直覺的時間選擇器"
date: 2016-12-26 11:11:11
category: "前端軍火庫"
tags:
---
在web app中遇到需要選擇日期、時間需求的時候，日期通常很簡單，大部分的UI元件都可以用表格做出一個簡單的日曆來選擇，而時間通常就比較沒那麼直覺，多半都是用個下拉選單選擇時間，或是直接輸入；而今天要介紹的[ClockPicker](https://weareoutman.github.io/clockpicker/)，則是一個採用更直覺的方式，讓我們能直接在時鐘上選擇時間的酷炫library。

<!-- more -->

# 開始使用ClockPicker

[ClockPicker](https://weareoutman.github.io/clockpicker/)相依於bootstrap，不過主要顯示時鐘的部分只相依於`.popover`跟`.btn`的樣式而已，因此ClockPicker的作者也有設計把這些樣式獨立出來只相依於jQuery的版本，可以自行選擇要載入`bootstrap-*`的版本(相依於jquery與bootstrap)還是`jquery-*`的版本(只相依於jquery)。

接著我們加入以下的HTML

```html
<div class="input-group clockpicker">
    <input type="text" class="form-control" value="12:34">
    <span class="input-group-addon">
        <span class="glyphicon glyphicon-time"></span>
    </span>
</div>
```

然後JavaScript只需要一行程式碼：

```javascript
$('.clockpicker').clockpicker();
```

就可以看到用時鐘選擇時間的畫面啦，非常簡單吧！

{% asset_img 0.png %}

# ClockPicker進階功能

ClockPicker也有許多參數可以選擇，例如時鐘預設是在textbox下面，我們可以透過`placement`參數來將時鐘移到textbox右邊：

```javascript
$('.clockpicker').clockpicker({
	placement: 'right'
});
```

或是透過`autoclose`參數，讓我們不需要按下時鐘的"完成"按鈕，只要選完時、分就自動完成選擇並關閉時鐘：

```javascript
$('.clockpicker').clockpicker({
  autoclose: true
});
```

我們也可以在程式中主動操作ClockPicker，例如按下某個按鈕後顯示時鐘

```javascript
$('#showClock').click(function(e){
	e.stopPropagation();
	$('.clockpicker').clockpicker('show');
});
```

程式碼DEMO: [https://jsfiddle.net/wellwind/n9LmazpL/](https://jsfiddle.net/wellwind/n9LmazpL/)

透過ClockPicker，顯示時間是不是更直覺了呢？

# 類似資源

*   [Bootstrap Material DatePicker](https://github.com/t00rk/bootstrap-material-datetimepicker/)：搭配了Material Design的樣式，本身就是個完整的日期/時間選擇器，選擇時間的部分雖然也是時鐘，但操作上比ClockPicker難使用一些。