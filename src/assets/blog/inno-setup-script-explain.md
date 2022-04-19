---
title: "[Inno Setup] 使用精靈產生的腳本解說"
date: 2022-02-03 15:42:20
category: "Inno Setup"
tags:
  - "Inno Setup"
---

前一篇我們提到[使用 Inno Setup 的腳本精靈來產生安裝檔腳本](https://fullstackladder.dev/blog/2022/02/02/inno-setup-quick-start/)，並編譯這個腳本來建立安裝檔，不過這個腳本精靈通常只會使用一次，因為產出的檔案是無法再次使用腳本精靈設定的，因此最終我們還是需要自行去維護這個腳本，今天就來看一下預設使用腳本精靈產生的內容有哪些，未來要維護或新增功能時就可以更容易上手了。

<!-- more -->

# 基本架構

以下說明一個 Inno Setup 腳本會經常看到的內容。

## 區塊

Inno Setup 的腳本基本是被安排在不同的區塊（Section）內各自設定的，每個區塊對應到安裝時的動作，在這些動作內在使用參數進行額外設定，例如：

```ini
[Setup]
AppName=Hello World
```

`[Setup]` 就是一個區塊的宣告，下面會有各種屬性的設定，例如 `AppName=Hello World` 就是在這個區塊內設定 `AppName`。

若是一行有多個屬性設定，則使用 `key1: value1; key2: value2` 的格式設定，如：

```ini
Name: "english"; MessagesFile: "compiler:Default.isl"
```

Inno Setup 所有的可以定義的區塊可以參考[文件](https://jrsoftware.org/ishelp/index.php?topic=setupsection)。

## 註解語法

在 `*.iss` 內，可以使用 `;` 當作單行開頭當作註解，後面的文字都不會被當作語法被編譯。

```ini
; Setup 區塊設定
[Setup]
; 設定 AppName
AppName=Hello World
```

## 全域變數定義

我們可以使用 `#define` 來定義一些全域變數，這些變數在之後可以使用 `{#name}` 的語法，在編譯時會被取代成定義好的變數，如果在腳本精靈的「Inno Setup Preprocessor」步驟有勾選的話，就會看到如下的程式定義：

```ini
#define MyAppName "HelloWorld"
#define MyAppVersion "beta"
#define MyAppPublisher "FullstackLadder"
#define MyAppURL "https://fullstackladder.dev/blog/"
#define MyAppExeName "HelloWorld.exe"
```

而在使用時就可以直接拿定義好的變數來用，例如：

```ini
[Setup]
AppName={#MyAppName}
AppVersion={#MyAppVersion}
```

其中的 `{#MyAppName}` 和 `{#MyAppVersion}` 就是前面透過 `#define MyAppName` 和 `#define MyAppVersion` 所定義好的資料料。

## 內建常數

Inno Setup 語法內建了許多常數，可以直接拿來使用，例如 `app` 代表實際上的應用程式安裝路徑，因此我們在指定要搬移哪些檔案到應用程式目錄時可以看到這樣的腳本：

```ini
[Files]
Source: "C:\path\to\{#MyAppExeName}"; DestDir: "{app}"; Flags: ignoreversion
```

其中的 `{app}` 在實際安裝時，會根據使用者設定的安裝目錄被替換。

Inno Setup 定義的常數可以參考[文件](https://jrsoftware.org/ishelp/index.php?topic=consts)。

# 腳本區塊解說

接著我們來看一下上一篇文章使用精靈所產生的腳本內容

## 全域變數定義

```ini
#define MyAppName "HelloWorld"
#define MyAppVersion "beta"
#define MyAppPublisher "FullstackLadder"
#define MyAppURL "https://fullstackladder.dev/blog/"
#define MyAppExeName "HelloWorld.exe"
```

這部分應該沒什麼問題，就是一些基本資訊的定義，在後續的其他區塊會用到。

## [Setup] 區塊

```ini
[Setup]
AppId={{557C0087-0AB3-4ED9-B1A4-3338C6AACC3B}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={autopf}\{#MyAppName}
DisableProgramGroupPage=yes
;PrivilegesRequired=lowest
OutputDir=Setup
OutputBaseFilename=HelloWorldSetup
SetupIconFile=C:\GitHub\hello-world\HelloWorldSetup\setup.ico
Compression=lzma
SolidCompression=yes
WizardStyle=modern
```

預設包含了這些選項：

- `AppId`：一個隨機的 GUID，單純識別用的
- `AppName`：應用程式名稱
- `AppVersion`：應用程式版本
- `AppPublisher`：應用程式發佈者
- `AppPublisherURL`：應用程式發佈者的網站
- `AppSupportURL`：客服網址
- `AppUpdatesURL`：新版本確認網址
- `DefaultDirName`：預設安裝目錄
    - `autopf` 會依照安裝目標而異，安裝給全部使用者和目前使用者會有所不同
- `DisableProgramGroupPage`：在安裝時能指定啟動選單的名稱
- `PrivilegesRequired`：安裝時需要的權限
    - 如果是安裝給全部使用者，這行預設會註解
    - 如果是安裝給目前使用者，只要取消這行註解即可
- `OutputDir`：安裝檔輸出路徑
- `OutputBaseFilename`：安裝檔檔案名稱
- `SetupIconFile`：安裝檔 icon 位置
- `Compression`：將所有程式打包起來的壓縮演算法
- `SolidCompression`：是否要將所有檔案打包成單一個安裝檔
- `WizardStyle`：安裝檔執行後的精靈樣式，分成 `modern` 和 `classic`

## [Language] 區塊

```ini
[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"
```

用來設定安裝程式介面的語言，如果有多個語言，可以一行一個，之後在安裝時可以選擇使用的語言檔。

## [Task] 區塊

```ini
[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked
```

Task 區塊不是必要的，它可以在安裝過程中執行一些使用者自訂的工作腳本，也會在安裝中出現 checkbox 或 radio button，讓使用者決定是否要執行這個工作，這個工作通常會跟其他區塊連結在一起（稍後說明）。

以上述範例來說，這個工作包含幾個設定

- `Name`：必填，指定的工作名稱
- `Description`：必填，描述文字，這裡的設定代表從語系檔抓取內容
- `GroupDescription`：一個工作群組的描述文字，這裡的設定代表從語系檔抓取內容
- `Flag`：可與使用者互動的設定

## [Files] 區塊

```ini
Source: "C:\GitHub\hello-world\HelloWorldSetup\HelloWorld\{#MyAppExeName}"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\GitHub\hello-world\HelloWorldSetup\HelloWorld\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
```

用來控制要安裝哪些檔案，一行一組設定，每組設定包含

- `Source`：檔案來源目錄
- `DestDir`：安裝時的目標目錄
- `Flags`：檔案複製時的相關設定，例如 `recursesubdirs` 代表下面所有的目錄都要一起安裝

## [Icons] 區塊

```ini
[Icons]
Name: "{autoprograms}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon
```

用來設定應用程式的**捷徑**，也就是除了程式主要安裝的目錄外，還有可以在哪些位置安裝捷徑，來開啟指定程式，設定包含

- `Name`：捷徑名稱
- `Filename`：捷徑實際檔案位置

第二行最後的 `Tasks: desktopicon` 對應到 `[Task]` 區塊的 `Name: "desktopicon"` 設定。

代表 `desktopicon` 這條設定在安裝過程中有被勾起來時，才執行目前這一行的設定，也就是真的在桌面建立捷徑。

## [Run] 區塊

```ini
[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent
```

代表在安裝過程中要執行的程式，主要設定包含

- `Filename`：要執行的程式位置
- `Description`：描述文字
- `Flags`：執行程式方式的設定，例如 `postinstall` 代表在安裝完成後執行
