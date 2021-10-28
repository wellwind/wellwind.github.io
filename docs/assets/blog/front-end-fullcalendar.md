---
title: "[前端軍火庫]FullCalendar - 輕鬆完成專業級行事曆"
date: 2016-12-21 11:11:11
category: "前端軍火庫"
tags:
---
行事曆功能在前端開發來說也是很常見的一種需求，例如透過行事曆來追蹤重要活動、代辦事項等等；而透過今天要介紹的[FullCalendar](https://fullcalendar.io/)，我們也能做出不輸給Google Calendar的強大行事曆！

<!-- more -->

# 開始使用FullCalendar

[FullCalendar](https://fullcalendar.io/)相依於jQuery與[Moment.js](http://momentjs.com/)，記得要先載入，之後載入FullCalendar的js/css後，我們只需要加一個div：

```html
<div id="calendar"></div>
```

接著在JavaScript中將這個div轉為calendar即可：

```javascript
 $('#calendar').fullCalendar();
```

如此一來就立刻可以看到一個基本的行事曆畫面啦！

{% asset_img 0.png %}

當然這樣還遠遠不夠，接下來我們要為行事曆加上更多東西。

[Moment.js](http://momentjs.com/)是一套強大的日期/時間處理library，可以用來處理各種JavaScript對於瀏覽器間處理日期等格式不同的問題，同時支援多國語系，非常好用！由於我們的主題在UI上，因此這個library只在此簡單說明一下。

# 為特定日期加入活動

身為一個行事曆，要能在特定的日期或日期區間加上活動，是非常合理且必要的，在FullCalendar中，稱之為[Event Object](https://fullcalendar.io/docs/event_data/Event_Object/)，我們先加入幾個預設的活動：

```javascript
  $('#calendar').fullCalendar({
    editable: true,
    events: [{
      title: '昨天的活動',
      start: moment().subtract(1, 'days').format('YYYY-MM-DD')
    }, {
      title: '持續一周的活動',
      start: moment().add(7, 'days').format('YYYY-MM-DD'),
      end: moment().add(14, 'days').format('YYYY-MM-DD'),
      color: 'lightBlue'
    }]
  });
```

首先我們設定`editable: true`，讓日期可以拖曳移動；接著我們搭配了Moment.js，第一個活動設為昨天一整天(`moment().subtract(1, 'days').format('YYYY-MM-DD')`)，第二個活動則持續一周，且設定顏色為淺藍色(`color: 'lightBlue'`)。

{% asset_img 1.png %}

如果需要動態產生活動，則需要搭配`renderEvent`：

```javascript
  $('#calendar').fullCalendar('renderEvent', {
    title: '明天的活動',
    start: moment().add(1, 'days').format('YYYY-MM-DD')
  });
```

{% asset_img 2.png %}

我們也可以給每個活動一個id(非必要)，如果有兩個活動id是一樣的，則會被視為同一個群組活動，當其中一個被拖曳時，群組內其他的活動也會跟著被移動：

```javascript
  $('#calendar').fullCalendar('renderEvent', {
    id: 'eventGroup1',
    	title: '活動1',
      start: moment().add(3, 'days').format('YYYY-MM-DD'),
      textColor: 'black',
      color: 'beige'
  });
  $('#calendar').fullCalendar('renderEvent', {
    id: 'eventGroup1',
    	title: '活動2',
      start: moment().add(5, 'days').format('YYYY-MM-DD'),
      textColor: 'black',
      color: 'beige'
  });
```

# 處理事件callback

剛剛的DEMO已經基本上可以操作行事曆上的資料了，我麼還可以加入`dayClick`和`eventClick`的callback，在某個日期空白處按下去的話或直接在某個事件上按下去時要進行的行為：

```javascript
$('#calendar').fullCalendar({
  dayClick: function(date, event, view) {
    console.log('add event');
    console.log(date);
    console.log(event);
    console.log(view);
  },
  eventClick: function(date, event, view) {
    console.log('modify event');
    console.log(date);
    console.log(event);
    console.log(view);
  }
});
```

# 其他設定選項

FullCalendar功能非常強大，可以設定的範圍也非常廣，甚至可以直接跟現有的Google行事曆整合，更多詳細的設定，就自行上[官方文件](https://fullcalendar.io/docs/)去探索吧！

今天的程式碼DEMO: [https://jsfiddle.net/wellwind/z9e0L9y5/](https://jsfiddle.net/wellwind/z9e0L9y5/)