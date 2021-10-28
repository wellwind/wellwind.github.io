---
title: "[Emotion API]蘋果工程師最瞧不起人?利用Emotion API分析各公司程式設計師的心情"
date: 2016-04-11 21:23:04
tags:
    - Emotion Api
    - Project Oxford
---

Emotion API是微軟Project Oxford專案提供的一組API，用來辨識圖片中人臉部上的情緒。之前曾經看到一篇文章：「[不負責研究之程式開發者調查：java 工程師最年輕，但是臉最臭](http://buzzorange.com/techorange/2016/03/25/unofficial-investigation-for-program-language/)」；利用GitHub上的developers照片配合Face API來分析各種語言開發人員的臉部特徵。覺得這是個滿有趣的主題，於是想說也來玩玩看，改用Emotion API來分析看看Apple、Facebook、Microsoft等公司工程師的表情如何。

<!-- more -->

# 使用Emotion API

要使用Emotion API，要記得先去申請[API Key](https://www.microsoft.com/cognitive-services/en-us/subscriptions)，而要用程式存取EmotionAPI的話，[官方的文件](https://www.microsoft.com/cognitive-services/en-us/emotion-api/documentation)已經提供了詳細的說明，也有非常方便使用的SDK，例如對於C#開發人員而言，可以直接透過NuGet安裝[Emotion API](https://www.nuget.org/packages/Microsoft.ProjectOxford.Emotion/)套件來使用。

安裝完後我們可以用本機圖片、圖片網址或影片的方式來，已使用本機圖片來說，官方提供的範例程式碼為：

```csharp
            // -----------------------------------------------------------------------
            // KEY SAMPLE CODE STARTS HERE
            // -----------------------------------------------------------------------

            //
            // Create Project Oxford Emotion API Service client
            //
            EmotionServiceClient emotionServiceClient = new EmotionServiceClient(subscriptionKey);

            window.Log("Calling EmotionServiceClient.RecognizeAsync()...");
            try
            {
                Emotion[] emotionResult;
                using (Stream imageFileStream = File.OpenRead(imageFilePath))
                {
                    //
                    // Detect the emotions in the URL
                    //
                    emotionResult = await emotionServiceClient.RecognizeAsync(imageFileStream);
                    return emotionResult;
                }
            }
            catch (Exception exception)
            {
                window.Log(exception.ToString());
                return null;
            }
            // -----------------------------------------------------------------------
            // KEY SAMPLE CODE ENDS HERE
            // -----------------------------------------------------------------------
```

程式碼看起來並不會很困難吧！就是把圖片讀到stream裡面然後傳給SDK就好了。

# 免責聲明

在說明分析結果之前，先照抄一下免責聲明XD

「應該指出的是，這超級非科學。你不知道 Face API 的準確率有多高，也不知道使用者的 GitHub 個人資料圖片映射到他們的個性 / 身份時有多準確。而且最多產的貢獻者流行的代碼倉庫是否能準確地反映一個社區也不清楚。此外，這是一個小樣本。」

# 程式碼下載

已經完成的程式碼已經都放在我的GitHub上了，有興趣觀看程式碼的朋友可以直接透過下列網址下載：

<https://github.com/wellwind/EmotionApiPractice>

# 抓取方法

由於程式碼其實不複雜，而且這篇的主要目標也是單純介紹Emotion API以及有趣的分析結果，所以只簡單說明一下我是怎麼寫程式去分析的

1.  先抓取GitHub上目標公司的成員頭像；抓取的按字母排序公司包含：Apple、Facebook、Google、Microsoft和Yahoo
2.  再用Emotion API分析每種情緒的分數
3.  手動透過EXCEL平均所有成員每種情緒的分數
4.  用EXCEL畫圖

# 分析結果

1.  **Anger**：看起來再Yahoo!工作的開發人員好像頗容易動怒的XD

    {% asset_img emotion-001.png %}

2.  **Contempt**：Apple的工程師最瞧不起人？

    {% asset_img emotion-002.png %}

3.  **Disgust**：在Facebook工作小心容易感到噁心？(要看太多有的沒的的照片關係？)

    {% asset_img emotion-003.png %}

4.  **Fear**：Yahoo跟Facebook的員工可能比較膽小？

    {% asset_img emotion-004.png %}

5.  **Hapiness**：幸福企業出爐！Google最高分，微軟只差一點點而已！

    {% asset_img emotion-005.png %}

6.  **Neutral**：Yahoo又上榜了，壓力大到面無表情了？

    {% asset_img emotion-006.png %}

7.  **Sadness**：看來在Yahoo工作是件令人沮喪的事

    {% asset_img emotion-007.png %}

8.  **Suprise**：Yahoo工程師的工作環境總是充滿驚喜？驚嚇？

    {% asset_img emotion-008.png %}

# 不負責結論

其實除了Yahoo以外其他公司的開發人員都是過半數露出快樂表情的，然後面無表情次之XD。所以寫程式這工作還是算很快樂的(?)。

對於愛好寫程式的開發人員而言，應該不少人多少都會憧憬能在Google這類的公司工作，根據數據證明(?)，Google對於開發人員依然是最幸福的所在，而微軟在擁抱開源後對於開發人員的工作心情也不會輸給Google。假如你喜歡跟一群天才工作，Apple大概是天才集散地吧？如果心臟夠大，在Facebook工作也是個不錯的考量。至於Yahoo...這裡各種情緒的人都有，可以多認識不同個性的人喔XD