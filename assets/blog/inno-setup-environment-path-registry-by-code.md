---
title: "[Inno Setup] 安裝時設定環境變數 (Registry)"
date: 2022-02-06 14:46:04
category: "Inno Setup"
tags:
  - "Inno Setup"
  - "[Registry]"
  - "[Code]"
---

有些時候，我們的程式會提供 CLI 指令給使用者，讓使用者可以自行下指令進行一些自動化的操作，這些 CLI 當然也都是執行檔，為了執行方便我們可以將程式位置加入 `Path` 環境變數，讓使用者可以直接輸入指令，而不用知道程式的所在位置。

在 Inno Setup 該如何做到安裝時自動把指令路徑加入 `path` 環境變數呢？

<!-- more -->

# 環境變數設定原理

環境變數是設定在「登入編輯程式 （Registry）」內的，也就是俗稱的「機碼」，以我們今天要設定的 `Path` 變數而言，所有使用者共用的位置為：

```
HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Environment
```

目前登入的使用者位置為：

```
HKEY_CURRENT_USER\Environment
```

而 `Path` 則是這個機碼下的一個變數，因此我們只要根據需要決定如何設定 `Path` 變數就好，接下來我們就以整台電腦的變數設定為範例說明。

# 使用 Inno Setup 設定環境變數

## 認識 [Registry] 區塊

在 Inno Setup 的腳本中，我們可以在 `[Registry]` 中設定 Registry 變數，Registry 變數是一個 key-value 的對應，例如

```ini
[Registry]
Root: HKLM; Subkey: "Software\My Company\My Program\Settings"; ValueType: string; ValueName: "InstallPath"; ValueData: "{app}"
```

設定選項分別為：

- `Root`：`HKLM` 代表 `HKEY_LOCAL_MACHINE`，另外還有
    - `HKCU`：`HKEY_CURRENT_USER`
    - `HKCR`：`HKEY_CLASSES_ROOT`
    - `HKU`：`HKEY_USERS`
    - `HKCC`：`HKEY_CURRENT_CONFIG`
    - `HKA`：當使用管理者模式安裝時，代表 `HKLM`；否則為 `HKCU`
- `Subkey`：主要 key 下的路徑
- `ValueType`：資料型別
- `ValueName`：資料名稱
- `ValueData`：資料內容

因此我們可以很簡單的替環境變數加上目前的路徑：

```ini
[Registry]
Root: HKCU; Subkey: "Environment"; ValueType: expandsz; ValueName: "Path"; ValueData: "{olddata};{app}"
```

`{olddata}` 代表的是原來的資料，後面再附加上程式安裝路徑 `{app}`，就是完整要設定的環境變數路徑了。

不過有一點問題，如果我們指定的路徑已經加入過了，會發生重複加入的情境，因此我們要寫一點小程式，來檢查這個路徑是否被加入過了。

## 認識 [Code] 區塊

我們可以在腳本內加上 `[Code]` 區塊，並在這個區塊內自行撰寫一些程式，語法為 Pascal 語法，以下範例為檢查指定路徑是否已存在環境變數 `Path` 內：

```pascal
[Code]
function NeedsAddPath(Param: string): boolean;
var
  OrigPath: string;
  ParamExpanded: string;
begin
  ParamExpanded := ExpandConstant(Param);
  if not RegQueryStringValue(HKEY_LOCAL_MACHINE,
    'SYSTEM\CurrentControlSet\Control\Session Manager\Environment',
    'Path', OrigPath)
  then begin
    Result := True;
    exit;
  end;
  Result := Pos(';' + UpperCase(ParamExpanded) + ';', ';' + UpperCase(OrigPath) + ';') = 0;  
  if Result = True then
     Result := Pos(';' + UpperCase(ParamExpanded) + '\;', ';' + UpperCase(OrigPath) + ';') = 0; 
end;
```

參考來源：https://stackoverflow.com/questions/3304463/how-do-i-modify-the-path-environment-variable-when-running-an-inno-setup-install

## 呼叫自訂程式

接下來我們在 `[Registry]` 區塊內設定時，可以加上 `Check` ，來決定是否要設定此段機碼：

```ini
[Registry]
Root: HKCU; Subkey: "Environment"; ValueType: expandsz; ValueName: "Path"; ValueData: "{olddata};{app}"; Check: NeedsAddPath(ExpandConstant('{app}')) 
```

如此一來就完整啦！
