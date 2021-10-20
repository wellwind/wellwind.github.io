---
title: "[Jquery.Unobtrusive] 動態增加驗證資訊"
date: 2014-09-29 23:47:03
tags:
    - jquery
    - jquery.unobtrusive
---

在使用jquery.unobtrusive時，可以在html表單欄位標籤中加入特殊屬性，讓表單在送出時自動驗證欄位而不必額外撰寫javascript就可以達到client端的驗證。不過當動態增加表單驗證欄位時，送出會無法對這些欄位檢查

<!-- more -->

在使用jquery.unobtrusive時，可以在html表單欄位標籤中加入特殊屬性，讓表單在送出時自動驗證欄位而不必額外撰寫javascript就可以達到client端的驗證。

最近遇到一種狀況是，當某個下拉選單選到1時，另一欄位須為必填，否則非必填，原本是這樣寫

```javascript
if ($('#StsCod').val() == '1') {
    $('#GetDt').addClass('textfield_must');
    $('#GetDt').attr('data-val-required', '請輸入領取日期');
} else {
    $('#GetDt').removeClass('textfield_must');
    $('#GetDt').removeAttr('data-val-required');
}
```

不過當表單送出時，依然沒有正確檢查，上網查了一下，必須讓validator重新處理過相關欄位，才會正常檢查

```javascript
if ($('#StsCod').val() == '1') {
    $('#GetDt').addClass('textfield_must');
    $('#GetDt').attr('data-val-required', '請輸入領取日期');
} else {
    $('#GetDt').removeClass('textfield_must');
    $('#GetDt').removeAttr('data-val-required');
}
 
// 讓validator重新parse需要的欄位
$('form').removeData('validator');
$('form').removeData('unobtrusiveValidation');
$.validator.unobtrusive.parse('form');
```