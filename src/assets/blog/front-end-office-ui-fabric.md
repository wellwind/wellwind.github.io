---
title: "[前端軍火庫]Office UI Fabric - 打造與Office365相同樣式的UI框架"
date: 2016-12-03 11:11:11
category: "前端軍火庫"
tags:
---
[Office UI Fabric](http://dev.office.com/fabric)是由Microsoft打造的UI框架，跟前兩天提到的Bootstrap和Materialize不一樣的地方是，透過Office UI Fabric我們可以很容易地打造出**具有Office365樣式的UI**。

如果你的user受到MS Office的啟發(?)希望你做一個類似的Office某個功能的UI，使用Office UI Fabric就會是最簡單的選擇！

<!-- more -->

# 使用Office UI Fabric

首先加入以下三個css/js

```
<link rel="stylesheet" href="https://static2.sharepointonline.com/files/fabric/office-ui-fabric-js/1.2.0/css/fabric.min.css">
<link rel="stylesheet" href="https://static2.sharepointonline.com/files/fabric/office-ui-fabric-js/1.2.0/css/fabric.components.min.css">
```

目前Office UI Fabric大多是React的Component，官方的網站文件也只看得到React的版本，非React的版本需要到GitHub上面去看

[https://github.com/OfficeDev/office-ui-fabric-js/tree/master/ghdocs](https://github.com/OfficeDev/office-ui-fabric-js/tree/master/ghdocs)

為了不要把問題複雜化，我們還是用單純的HTML來處理，以下是一個簡單的[PeoplePicker](https://github.com/OfficeDev/office-ui-fabric-js/blob/master/ghdocs/components/PeoplePicker.md)的範例

DEMO網址為:[https://jsfiddle.net/wellwind/8kxq2u4r/](https://jsfiddle.net/wellwind/8kxq2u4r/)

HTML部分

```html
<div class="ms-PeoplePicker">
  <div class="ms-PeoplePicker-searchBox">
    <div class="ms-TextField  ms-TextField--textFieldUnderlined ">
      <input class="ms-TextField-field" type="text" value="" placeholder="選擇聯絡人名單">
    </div>
  </div>
  <div class="ms-PeoplePicker-results">
    <div class="ms-PeoplePicker-resultGroup">
      <div class="ms-PeoplePicker-resultGroupTitle">
        聯絡人
      </div>
      <div class="ms-PeoplePicker-result " tabindex="1">
        <div class="ms-Persona ms-Persona--sm">
          <div class="ms-Persona-imageArea">
            <div class="ms-Persona-initials ms-Persona-initials--blue">RM</div>
          </div>
          <div class="ms-Persona-presence">
          </div>
          <div class="ms-Persona-details">
            <div class="ms-Persona-primaryText">Russel Miller</div>
            <div class="ms-Persona-secondaryText">Sales</div>
          </div>
        </div>
        <button class="ms-PeoplePicker-resultAction"><i class="ms-Icon ms-Icon--Clear"></i></button>
      </div>
      <div class="ms-PeoplePicker-result " tabindex="1">
        <div class="ms-Persona ms-Persona--sm">
          <div class="ms-Persona-imageArea">
            <div class="ms-Persona-initials ms-Persona-initials--purple">DF</div>
          </div>
          <div class="ms-Persona-presence">
          </div>
          <div class="ms-Persona-details">
            <div class="ms-Persona-primaryText">Douglas Fielder</div>
            <div class="ms-Persona-secondaryText">Public Relations</div>
          </div>
        </div>
        <button class="ms-PeoplePicker-resultAction"><i class="ms-Icon ms-Icon--Clear"></i></button>
      </div>
      <div class="ms-PeoplePicker-result " tabindex="1">
        <div class="ms-Persona ms-Persona--sm">
          <div class="ms-Persona-imageArea">
            <div class="ms-Persona-initials ms-Persona-initials--black">GS</div>
          </div>
          <div class="ms-Persona-presence">
          </div>
          <div class="ms-Persona-details">
            <div class="ms-Persona-primaryText">Grant Steel</div>
            <div class="ms-Persona-secondaryText">Sales</div>
          </div>
        </div>
        <button class="ms-PeoplePicker-resultAction"><i class="ms-Icon ms-Icon--Clear"></i></button>
      </div>
      <div class="ms-PeoplePicker-result " tabindex="1">
        <div class="ms-Persona ms-Persona--sm">
          <div class="ms-Persona-imageArea">
            <div class="ms-Persona-initials ms-Persona-initials--green">HW</div>
          </div>
          <div class="ms-Persona-presence">
          </div>
          <div class="ms-Persona-details">
            <div class="ms-Persona-primaryText">Harvey Wallin</div>
            <div class="ms-Persona-secondaryText">Public Relations</div>
          </div>
        </div>
        <button class="ms-PeoplePicker-resultAction"><i class="ms-Icon ms-Icon--Clear"></i></button>
      </div>
    </div>
    <button class="ms-PeoplePicker-searchMore">
      <div class="ms-PeoplePicker-searchMoreIcon">
        <i class="ms-Icon ms-Icon--Search"></i>
      </div>
      <div class="ms-PeoplePicker-searchMoreText">
        Search my groups
      </div>
    </button>
  </div>
</div>
```

JavaScript部分

```javascript
  var PeoplePickerElements = document.querySelectorAll(".ms-PeoplePicker");
  for (var i = 0; i < PeoplePickerElements.length; i++) {
    new fabric['PeoplePicker'](PeoplePickerElements[i]);
  }

```

執行結果如下圖：

{% asset_img 0.png %}

是不是跟Office產品的樣式很像啊！透過Office UI Fabric，要打造出有Office 365樣式的UI也變得很容易囉！

# 搭配React或AngularJS

前面有提到，官方網站的範例程式主要都是React元件，因此如果要使用React的版本，可以直接到網站上去看[http://dev.office.com/fabric](http://dev.office.com/fabric) 。

另外也提供了AngularJS的元件版本也可以從以下網址進入[http://ngofficeuifabric.com/](http://ngofficeuifabric.com/) 。