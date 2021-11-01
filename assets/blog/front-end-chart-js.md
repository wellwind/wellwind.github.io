---
title: "[前端軍火庫]Chart.js - 輕鬆完成資料視覺化"
date: 2016-12-30 11:11:11
category: "前端軍火庫"
tags:
---
隨著大數據越來越熱門，資料視覺化也變得越來越重要，能夠以簡單明瞭的圖像顯示數據的意義，對於決策者進行決策有非常大的幫助，過去要製作這些資料圖表大多必須依靠Excel這類軟體來繪製，但靈活度不高，也難以跟資料庫連接處理，更別說不太好看了。所以今天就來紀紹一個前端資料視覺化的library - [Chart.js](http://www.chartjs.org/)

<!-- more -->

# 關於Chart.js

Chart.js是一款彈性很高的圖表JavaScript library，支援八種常見的統計圖表類型，夠將圖表混合在一起使用，也支援動畫的效果，讓我們製作出來的圖表更加精美！

# 開始使用Chart.js

載入Chart.js之後，我們可以先將要顯示圖表的位置加入一個canvas

```html
<canvas id="myChart" width="400" height="400"></canvas>
```

接著我們要先取得這個canvas

Chart.js接受多種取得canvas的方式，以下幾行的程式碼Chart.js都可以接受

```javascript
var ctx = document.getElementById('myChart');
var ctx = document.getElementById('myChart').getContext('2d');
var ctx = $('#myChart');
var ctx = "myChart";
```

接著就可以準備加入統計圖表啦！我們先加入一個柱狀圖來試試看

```javascript
var ctx = document.getElementById('myChart');
var myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['一月', '二月', '三月'],
    datasets: [{
      label: '銷售業績(百萬)',
      data: [60, 49, 72]
    }]
  }
});
```

就能夠看到一個基本的柱狀圖啦，不過目前看起還有點單調，我們可以為每筆資料加上顏色

```javascript
var ctx = document.getElementById('myChart');
var myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['一月', '二月', '三月'],
    datasets: [{
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)'
      ],
      borderWidth: 1,
      label: '銷售業績(百萬)',
      data: [60, 49, 72]
    }]
  }
});
```

{% asset_img 0.png %}

這樣看起來是不是漂亮很多阿！

# 混合bar chart與line chart

Chart.js也支援[混合類型的圖表](http://www.chartjs.org/docs/#chart-configuration-mixed-chart-types)，能夠將將多個bar chart跟多個line chart放在一起比較；最外層的圖表類型必須設定為bar，接著在dataset中即可設定每種資料的類型，例如以下程式：

```javascript
var ctx = document.getElementById('myChart');
var myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['一月', '二月', '三月'],
    datasets: [{
    type: 'bar',
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)'
      ],
      borderWidth: 1,
      label: '銷售業績(百萬)',
      data: [60, 49, 72]
    }, {
      type: 'line',
      label: '新開發客戶',
      data: [25, 13, 30]使用
    }]
  }
});
```

{% asset_img 1.png %}

# 其他參數設定

Chart.js還有很多彈性的參數選項和事件處理可以設定，讓你的圖表效果更加豐富，也更具有互動性，關於這些設定，就自行上[Chart.js的文件](http://www.chartjs.org/docs/)研究囉!

透過Chart.js，要做出精美的統計圖表就不在事件難事啦！

# 類似資源

*   [D3.js](https://d3js.org/): D3.js是一款自由度超高，功能超強的資料視覺化library，透過D3.js我們可以很靈活的將資料與HTML Canvas綁在一起，D3.js預設不包含任何種類的統計圖表，因此自由度雖然高，但也需要更多的程式碼來完成想要效果，當然比起不靠任何library還是簡單得多了！
*   [C3.js](http://c3js.org/): 以D3.js為基礎發展出來的library，內建多種統計圖表，可以用更快的方式完成基本的圖表，又具有一定程度D3.js的靈活性。
*   [morris.js](http://morrisjs.github.io/morris.js/): 相依於jQuery且支援的圖表類型也不多，但也有參考的價值。
*   [jVetor Map](http://jvectormap.com/): 跟前面介紹的統計圖表不同，jVectorMap是世界地圖的數據視覺化！例如我們可以透過jVectorMap顯示商品在世界各國的銷售情形；或是訪客的流量來源大多來自什麼國家等等，算是非常專門的library。
*   [Highcharts](http://www.highcharts.com/): 支援的圖表類型超豐富，更特別的是它還支援股票的K線圖，對於時序型的圖表能更加清楚的顯示，還有數十種plugins可以使用，算是非常完整強大！對於個人使用是沒什麼問題，但對於商業軟體則需要購買license，但對於需要完整圖表及技術支援的公司來說是不錯的選擇囉。