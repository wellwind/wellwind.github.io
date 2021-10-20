---
title: "[SpecFlow]使用SSMS將真實資料轉為Scenario Table的小技巧"
date: 2016-04-29 21:55:08
tags:
    - SpecFlow
    - SSMS
    - SQL
---

有些系統在開發時，常常會直接用真實世界資料庫中的資料做為測試案例，這樣在開發時會更貼近實際需求的行為；而當使用SpecFlow來描述Feature時，把真實資料庫中的資料轉成相關資料的Table時有一些小技巧可以使用。

<!-- more -->

# 自訂欄位分隔符號

之前參考這篇文章[[SpecFlow\][SSMS] 利用 SSMS 產生 Scenario Table](https://dotblogs.com.tw/yc421206/2016/01/11/232015)，可以在SSMS中設定自訂分隔符號為`|`：

{% asset_img spec-flow-001.png %}

接著查詢時選擇「以文字結果顯示」，再進行查詢，就可以看到資料欄位用自訂的分隔符號分開了

{% asset_img spec-flow-002.png %}

# 解決每列資料頭尾沒分隔符號的問題

這樣已經可以省掉很多時間了，尤其是欄位多的時候，但每行資料都還是要手動補上頭尾的分隔符號`|`，假設只有幾筆資料到還好，但其實就算只有10筆，我都覺得有點麻煩...(懶)；之前沒特別想法而且光是可以省去每隔個欄位打分隔符號就很開心了，不過用了幾個月下來，還是會忍不住覺得手動加入頭尾分隔符號很麻煩；今天靈光一閃想到一個很簡單的解法，直接在查詢時**頭尾加上一個查詢空字串的欄位**就解決了！

原本SQL為

```sql
SELECT TOP(100) 
	[ContactId], 
	[CompanyName], 
	[Address]
FROM Contacts
```

頭尾加上空字串查詢變成

```sql
SELECT TOP(100) 
	'',
	[ContactId], 
	[CompanyName], 
	[Address],
	''
FROM Contacts
```

查詢結果：

{% asset_img spec-flow-003.png %}

可以看到就會變成完整SpecFlow中的table格式，直接貼上去就可以使用囉！

# 結論

果然科技始終來自於惰性阿XD