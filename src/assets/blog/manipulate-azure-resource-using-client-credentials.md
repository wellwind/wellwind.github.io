---
title: "使用 Client Credentials 來取得具有 Azure REST API 權限的 Access Token"
date: 2022-10-22 12:57:05
category:
  - "Azure"
tags:
  - "Azure"
  - "Client Credentials"
---

如果有在使用 Azure，一般會直接在 Azure Portal 上操作，或是透過 Azure CLI；但是如果要在程式中操作 Azure 資源，就需要透過 Azure REST API 來呼叫。

Azure 當然也提供了許多 SDK 讓我們不需要花太多時間去研究 REST API，不過背後原理都是透過 REST API 呼叫，如果遇到使用的語言沒有對應的 SDK，還是必須自己用 REST API 來呼叫，因此研究一下背後的 API 還是很有價值的。

這篇文章就來看一下如何透過 Client Credentials 的方式來呼叫 Azure REST API。

<!-- more -->

# 建立 Azure Client

Azure 所以資源的存取，都遵循 OAuth 2.0，因此我們需要先建立一個 Azure Client，之後再以這個 Client 來幫我們取得可以操作相關資源的 Access Token。

## 使用 Azure Portal 建立

在 Azure 上，無論使用哪種授權方式，都需要先建立一個 Client，我們可以在 Azure Portal 的 Azure Active Directory 中的「App registerations」點擊上方「New registration」，來建立一個新的 Client。

{% asset_img 01.png %}

自訂一個名稱後，其他都可以保留預設值，之後點擊「Register」。

{% asset_img 02.png %}

之後在這個新註冊的 App 內，選擇左邊的「Certificates & secrets」，點擊「New client secret」，來建立一個新的 Client Secret。

名稱可以隨意，選擇適當的有效期限(最常為兩年)，之後點擊「Add」。

{% asset_img 03.png %}

建立好 Secret 之後，此時可以看到這個 Secret 的值，請務必在這時候將 Secret 抄下來，因為之後就無法再看到這個資料了。

{% asset_img 04.png %}

接下來我們要指派資源的權限給這個 Client，在 Azure 上有非常完整的權限管理，在任何訂閱、資源群組、資源上都可以設定權限，因此我們需要先找到要操作的資源，並且指派需要的權限角色給這個 Client，只要在可以設定權限的項目中點擊左邊的「Access control (IAM)」，選擇想要指派給 Client App 的角色即可。

{% asset_img 05.png %}

要特別注意的是，在選擇指派的成員時，要「完整輸入 Client App 的名稱」，不然可能會找不到。

{% asset_img 06.png %}

正確指派完權限角色，就可以在「Role assignments」中看到這個 Client App 了。

## 使用 Azure CLI 建立

在 Azure 中這些 App 也被稱為「Service Principal」，我們也可以透過 Azure CLI 來建立這個 Service Principal，同時指派給指定的資源。

```shell
az ad sp create-for-rbac \
  --name {{sp名稱}} \
  --scopes "/subscriptions/{{訂閱 ID}}/resourceGroups/{{資源群組名稱}}" \
  --role {{角色名稱}}
```

一樣的建立後會會得到 Client ID 和 Secret，記得 Secret 要保存起來。

# 產生 Access Token

接著我們就可以用這個 Client ID 和 Secret 來產生 Access Token 了。

- 授權位址：`https://login.microsoftonline.com/{{tenantId}}/oauth2/v2.0/token`
  - tenantId 可以在 Azure Portal 的 Azure Active Directory 中的「Overview」找到
- post body：
  - grant_type：固定為 `client_credentials`
  - client_id：建立 Client 時取得
  - client_secret：建立 Client 
  - scope：
    - 如果要管理 Azure 的話為 `https://management.azure.com/.default`
    - 如果是其他微軟的資源，要找出對應的 scope，並在最後加上 `/.default`

以下為 Postman 的示範

{% asset_img 07.png %}

接著就可以用這個 Access Token 去操作有權限的 Azure 資源啦！

例如我們可以透過以下 Azure REST API 取得 App Service 的基本資訊：

```
GET https://management.azure.com/subscriptions/{{subscriptionId}}/resourceGroups/{{resourceGroup}}/providers/Microsoft.Web/sites/{{siteName}}?api-version=2022-03-01
```

只要在 header 加上 `Authorization: Bearer {{token}}` 即可。

{% asset_img 08.png %}
