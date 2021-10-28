---
title: "[Luxon] 顯示 UTC 時間而非當地時間"
date: 2021-07-10 19:33:07
tags:
---



[Luxon](https://moment.github.io/luxon) 是一套輕巧但強大的時間處理 library，可以幫助我們快速解析來源時間字串，並處理好時區問題，不過預設處理時區有時候也會帶來一些困擾，今天就筆記一下如何用 Luxon 來處理各種時區問題。

<!--more-->

# 問題

快速看個例子：

```typescript
DateTime
  .fromISO('2021-01-09T18:00:00Z')
  .toFormat('yyyy/MM/dd');
// 2021/01/10
```

我們的日期來源是 `2021-01-09T18:00:00Z` 這個 UTC 時間，使用 Luxon 的 `DateTime.fromISO()` 可以輕易的解析出這個時間，單純以 UTC 時間來看日期是 `2021-01-09`，而經過 `toFormat('yyyy/MM/dd')` 後的日期則是 `2021/01/10` 看起來似乎是差了一天。

為什麼會這樣呢？那是因為 Luxon 在解析完字串後，會貼心地幫我們轉為當地的時區時間，我們可以用 `toISO()` 來看一下轉換後的時間格式：

```typescript
DateTime
  .fromISO('2021-01-09T18:00:00Z')
  .toISO()
// 2021-01-10T02:00:00.000+08:00
```

以我目前在台灣的時區 `+08:00` 來說，實際上的 ISO 時間為：`2021-01-10T02:00:00.000+08:00`，可以看到確實幫我們轉成了當地的時區時間。

這麼做的好處是，通長時間資料是會存在 server 端的，而 server 端就不用去煩惱儲存的格式，統一使用 UTC 時間即可，當前端收到資料要顯示時，透過 Luxon 轉換後，則可以單純的使用當地時間去思考就好。

這麼做當然用意是好的，但有時候我們就是希望顯示 UTC 時間該怎麼辦呢？

# 使用 setZone

Luxon 也提供的 `setZone` 來幫助我們指定時區

```typescript
DateTime
  .fromISO('2021-01-09T18:00:00Z')
  .setZone('utc')
  .toFormat('yyyy/MM/dd');
// 2021/01/09

DateTime
  .fromISO('2021-01-09T18:00:00Z')
  .setZone('utc')
  .toISO()
// 2021-01-09T18:00:00.000Z
```

如此一來就可以正常顯示 UTC 時間啦！

透過 `setZone` 可以幫助我們快速的指定各種時區顯示時間，因此也不用侷限在 UTC 時間，例如想轉換成美國的芝加哥時間，則可以設定 `setZone('America/Los_Angeles')`，各個時區對應可以在 wiki 上都查得到，我也會附上連結在最後的參考資料內。

另外，在解析 ISO 時間時，其實也可以直接指定時區，不過我還是偏愛使用 `.setZone()` 這種書寫方式，所以單純當作筆記參考用：

```typescript
DateTime
  .fromISO('2021-01-09T18:00:00Z', { zone: 'America/Los_Angeles' })
  .toISO()
// 2021-01-09T10:00:00.000-08:00
```

# 本日小節

Luxon 真的是功能非常強大的 library，又不像 moment 那麼肥大，實際上 Luxon 也是 moment 團隊內的成員打造出來的，目標也是提供更輕量且標準的時間處理工具。

開發系統難免會遇到各種時間問題，Luxon 提出了很棒的解決方案，文件也非常豐富，以後有機會遇到其他特別狀況再提出來討論。

# 參考資料

* [Luxon - Time zones and offsets](https://moment.github.io/luxon/#/zones)
* [Luxon - Changing zones](https://moment.github.io/luxon/#/zones?id=changing-zones)
* [Wiki - List of tz database time zones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

