---
title: "[Inno Setup] 讓程式在系統登入時自動開啟執行"
date: 2022-02-05 15:00:39
category: "Inno Setup"
tags:
  - "Inno Setup"
  - "[Tasks]"
  - "[Icons]"
  - "{commonstartup}"
  - "{user startup}"
---

很多時候我們會希望常用程式能在登入時自動開啟執行，這麼一來可以省去我們手動去開啟程式的時間；當使用 Inno Setup 打包安裝檔時，我們也可以將程式設定成開機自動執行。

<!-- more -->

# 自動執行原理

先來說明一下程式能自動執行的原理，每當 Windows 系統啟動登入時，會去檢查指定目錄中是否有設定程式，如果有，則會開啟這些程式。

在登入系統時，會檢查兩個目錄，我們可以在先按下 `Win + R`，接著輸入以下指令開啟目錄：

- `shell:common startup`：代表所有使用者登入時會啟動的程式
    - 通常預設目錄為：`C:\ProgramData\Microsoft\Windows\Start Menu\Programs\StartUp`
- `shell:startup`：代表每個使用者自行定義的啟動程式
    - 通常預設目錄為：`C:\Users\{username}\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup`

因此我們只要在安裝程式時，設定在這些目錄安裝捷徑就可以了！

# 使用 Inno Setup 建立自動執行捷徑

## 自動執行的捷徑目錄變數

要建立捷徑，可以在 `[Icons]` 中設定捷徑到開機執行的目錄，在 Inno Setup 中有兩個全域變數分別代表所有使用者和目前使用者的啟動目錄：

- `{commonstartup}`：所有使用者
- `{userstartup}`：目前使用者

因此腳本寫起來大概會如下：

```ini
[Icons]
; 給所有使用者
Name: "{commonstartup}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}";
; 給目前登入的使用者
Name: "{userstartup}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}";
```

就看是要提供給所有使用者都自動執行，還是給目前使用者自動執行就好。

## 由使用者自行決定是否開啟執行

直接在使用者登入自動執行當然很方便，不過如果能問過使用者，讓使用者自行決定，在體驗上會更好，我們可以將這些執行指令用自定義的 Task 串連起來，讓使用者決定是否要執行這些 Task：

```ini
[Tasks]
Name: "norunstartup"; Description: "不執行"; GroupDescription: "啟動時自動執行"; Flags: exclusive
Name: "runoncommonstartup"; Description: "所有使用者"; GroupDescription: "啟動時自動執行"; Flags: exclusive unchecked
Name: "runonuserstartup"; Description: "目前使用者"; GroupDescription: "啟動時自動執行"; Flags: exclusive unchecked

[Icons]
Name: "{commonstartup}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: runoncommonstartup
Name: "{userstartup}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: runonuserstartup
```

在 `[Tasks]` 裡面，我們可以用同樣名稱的 `GroupDescription` 來將「不執行」、「所有使用者」和「目前使用者」放到一個群組內，另外加上 `Flags: exclusive`，來讓選項變成 radio box （單選），另外「所有使用者」和「目前使用者」的 Flags 加上了 `unchecked`，如此一來預設被選取的就是 「不執行」了。

{% asset_img 01.png %}

之後的 `[Icons]` 內對應 `runoncommonstartup` 和 `runonuserstartup` 兩個工作來決定當使用者選擇某個選項後要建立的捷徑，如果選擇「不執行」，則只會有 `norunstartup` 這個 Task 被選擇，因此兩種捷徑都不會建立。

{% note info %}

在 `[Tasks]` 內有另外一個 Flag `dontinheritcheck`，可以確保在移除後，下次重新安裝時不會紀錄上次的選項，如果沒有設定，則下次安裝時會紀錄上次選擇的選項。

{% endnote %}

## 語系調整

最後，如果有設定讓使用者可以選擇安裝語言時，可以將這些文字移動到語言檔中，原來的內容改成去語言檔抓：

```ini
[Tasks]
Name: "norunstartup"; Description: "{cm:NoRunOnStartup}"; GroupDescription: "{cm:RunOnStartup}"; Flags: exclusive
Name: "runoncommonstartup"; Description: "{cm:RunOnCommonStartup}"; GroupDescription: "{cm:RunOnStartup}"; Flags: exclusive unchecked
Name: "runonuserstartup"; Description: "{cm:RunOnUserStartup}"; GroupDescription: "{cm:RunOnStartup}"; Flags: exclusive unchecked
```

之後再語言檔中的 `[CustomMessages]` 補上文字說明：

```ini
[CustomMessages]
...
RunOnStartup=啟動時自動執行
NoRunOnStartup=不執行
RunOnCommonStartup=所有使用者
RunOnUserStartup=目前使用者
```

{% note warning %}

當然，有其他語言檔的話也都要更新。

{% endnote %}

