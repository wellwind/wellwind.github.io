---
title: "[Angular Universal] 使用 Prerender 建立自己的 Static Site Generator"
date: 2021-10-16 13:32:39
category: "Angular 進階議題"
tags:
  - Angular
  - Angular Universal
  - Prerender
  - Static Site Generator
---

隨著 Angular 不斷的改版，原來難用且功能差強人意的 [Angular Universal](https://angular.io/guide/universal) 在不知不覺已經變得相當完整及強大，搭配 [Prerender](https://angular.io/guide/prerendering) 功能，不用再依靠如 Hexo、Scully 等工具，要刻出屬於自己的 Static Site Generator (靜態網站產生器) 也變得相當容易，今天就來簡單看一下 Angular Universal 現在變得多麼簡單，且透過 Prerender 功能來打造一個簡單的 Static Site Generator 吧！

<!-- more -->

* 範例程式：https://github.com/wellwind/ngx-universal-prerender-demo
* Live Demo：https://wellwind.idv.tw/ngx-universal-prerender-demo/
  * 可以檢視任一個頁面的原始碼，所有內容都是預先產生好的！

# Angular Universal 超快速入門

我們先做一個簡單的網站，並建立幾個頁面，來驗證 Angular Universal 的功能。

{% asset_img 01.png %}

路由設置如下：

```typescript
[
  { path: '', component: HomeComponent },
  { path: 'about-me', component: AboutMeComponent },
  { path: 'site-map', component: SiteMapComponent }
]
```

其實就是 3 個路由設定並指定顯示元件而已，在未套用 Angular Universal 時，打開檢視首頁或任一頁面的原始碼都只有單純的 `<app-root>` 等資訊，元件不會被產生。

{% asset_img 02.png 只有 app-root，剩下的都要等瀏覽器幫忙產生 %}

## 安裝 Angular Universal

接著讓我們套用 Angular Universal，來達成 Server Side Rendering (伺服器端渲染) 的需求。

準備好了嗎？首先用以下指令安裝 Angular Universal：

```bash
ng add @nguniversal/express-engine
```

然後...就沒有然後了！

在早期的版本除了安裝套件外，還要自己去建立一個 express server，並且在原來的專案中加入一堆設定才能完成，拜 Angular Schematics 所賜，現在真的只剩下一行指令就搞定了！大幅替我們省下枯燥且乏味的環境設定手續。

不多說，直接看看效果，我們可以在地端直接開啟 Angular Universal 提供的具有 SSR 功能的伺服器：

```shell
npm run dev:ssr
```

接著打開網站，並檢視任一個頁面的原始碼，可以發現網頁內容已經在伺服器端就先產生好了

{% asset_img 03.png 除了 app-root 外， 其他網頁內容也都在伺服器端產生了 %}

現在要使用 Angular Universal，真的是超級簡單啊！

{% note info %}

使用 `dev:ssr` 指令，在開發過程中，隨時可以修改目前的網頁原始碼，並檢視 SSR 產生的結果，但由於每次存檔後都需要將目前專案重新 build 過，因此會花費比較多的時間，因此平常最好還是使用 `npm start` 比較快速，在需要針對 SSR 成果微調時，才使用 `npm run dev:ssr` 指令。

{% endnote %}

## 超簡單原理解說

在執行 `npm run dev:ssr` 時，Angular CLI 會幫我們將前端專案打包好，並且透過 watch mode 在檔案變更時也會進行重新打包；除此之外，也會將 `server.ts` 進行打包，這個 `server.ts` 的內容就是用 express.js 建立一個伺服器，並且根據網頁發出的請求將打包好的網站內容在伺服器端先渲染好，再回傳回去。

因此在執行 `npm run dev:ssr` 後，可以在輸出的 `dist` 目錄中找到兩個目錄：

{% asset_img 04.png %}

`browser` 目錄就是將前端專案打包後的網站內容，而 `server` 目錄內放的就是 express server，在 production 環境下，只要把這些目錄都放到伺服器上，並執行 `server` 目錄內的 `main.js` 伺服器即可！

{% note info %}

當使用 `ng add @nguniversal/express-engine` 安裝 Angular Universal 時，是使用 express 當作 SSR 伺服器，但理論上任何類型的 web server 都可以當作 SSR 伺服器，只要能夠呼叫 `@angular/platform-server` 的 `renderModule()` 即可，官方也有不同 server 的實作版本如 [@nguniversal/aspnetcore-engine](https://www.npmjs.com/package/@nguniversal/aspnetcore-engine)，可以上 npm 搜尋 `@nguniversal` 找找更多不同的實作。

{% endnote %}

# 使用 Prerender 功能

使用 Angular Universal 的 SSR 功能雖然很方便，但也有個小缺點，就是一定要有一個能夠跑 node.js 的伺服器去執行 express server 來幫忙在伺服器端產生內容，但因為要在伺服器端進行運算所以通常這類主機都會比較貴一點，如果只是想做個小作品，或寫寫 blog，就顯得有點浪費；而不用在伺服器運算的主機就便宜很多，甚至像 GitHub Pages 就是個完全免費且廣受歡迎的一個選擇！

當然，這樣的情況下就必須在本地端先將網站內容全部轉換成靜態的網頁，再進行上傳，通常這種技術叫做「Prerender (預先產生)」；而當我們安裝 `@nguniversal/express-engine` 時，就已經將 prerender 功能也一併裝下來了，我們可以直接將所有網站頁面都轉換成靜態內容：

```shell
npm run prerender
```

此時除了把前端程式和後端程式打包好外，也會另外解析目前的路由設定，把所有可能的頁面都透過一樣的機制產生好，並講產生出來的靜態網頁內容也放到打包好的前端專案目錄內。

{% asset_img 05.png %}

接著打開 `browser` 目錄，就可以看到 `about-me` 和 `site-map` 兩個目錄：

{% asset_img 06.png %}

進到該目錄內，可以看到只有一個 `index.html` 檔案，裡面的內容就是這個頁面預先渲染好的 HTML，因此只要整包靜態網站丟到伺服器上，就可以輕輕鬆鬆把所有內容都上傳上去囉！

{% note warning %}

要特別注意的是，當我們設定路由時都是指定如 `/about-me` 格式，但此時實際上內容的網址為 `/about-me/index.html`，因此上傳的靜態網站伺服器必須能夠提供指定網址為目錄時，自動提供目錄內的 `index.html` 功能，不過絕大多數的伺服器都提供這個功能，如完全免費的 GitHub Pages，因此也不用太擔心。

{% endnote %}

## 使用 routes-file 參數指定產生內容的網址

在使用 Prerender 時，會去分析我們前端專案的路由設定，不過也不是所有路由都可以正確分析出來產生，例如有指令參數的路由，如 `post/:id` 這類型，只看路由表是不可能知道有那些頁面的，此時我們可以指定一個文字檔，讓 prerender 之道除了目前可以分析到的路由外，還有哪些網址是我們需要去產生的。

文字檔範例 (`post-routes.txt`)：

```text
/blog/post/post-1
/blog/post/post-2
/blog/post/post-3
/blog/post/post-4
```

使用指令範例：

```shell
npm run prerender -- --routes-file post-routes.txt
```

根據我自己的實際測試，隨便挑選一篇文章當作內容產生兩千個頁面，在 Surface Pro 6 下且開了一堆 IDE、Docker 和各種服務的情境下，從打包前後端程式到產生頁面完成，也不過就是 3~5 分鐘的事情，這樣的效能應該能輕鬆應付大部分內容網站的需求了！！

有了這些功能，就能輕鬆產生各種靜態內容，自己刻一個 Static Site Generator 就非常容易啦！

# 實作範例：Blog 網站靜態內容產生器

最後讓我們延伸這些功能，實作一個簡單的靜態內容產生器，將寫好的 markdown 都轉成靜態頁面！

由於中間還是不少技術細節，以下為經過多次嘗試後的結論，大致說明幾個重要步驟和需要注意的部分。



## 前置重要準備

首先為了方便，許多的靜態檔案如 markdown 內容等都會放在 `src/assets` 內，因為 Angular CLI 建立好的專案預設就會將這些內容當作是靜態資源，之後再透過 API 抓取這些內容顯示，簡單的程式碼說明：

```typescript
posts$ = this.httpClient.get('assets/blog/posts.json');
```

只要設置得當，在 Prerender 時，也會等我們把這些 API 抓取的行為和顯示都完成後才處理渲染動作。

而在這裡最大的問題是，當使用 Prerender 時，並沒有實際上的伺服器被執行，因此相對路徑會失效，導致抓不到內容，甚至在 Prerender 過程中因此造成不斷的循環等待，因此有兩個重要的地方要注意：

1. 需要在執行 Prerender 時，執行一個伺服器來提供這些靜態檔案
2. 當抓不到資料時，要做出適當的錯誤處理

### 提供靜態內容

針對顯示靜態內容的部分，可以使用 lite-server 幫我們快速達成

```shell
npx lite-server --baseDir=./src
```

之後抓資料時必須指定完整的網址才能正常抓到資料：

```typescript
// 要看實際上 lite-server 開啟後的 port
posts$ = this.httpClient.get('http://localhost:3000/assets/blog/posts.json');
```

### 為了抓取靜態內容的調整

實際上線時，除了進入該頁時本來就會有靜態內容之外，其餘的過程還是會走 Angular 本身的處理，因此透過路由機制切換到其他頁面時，就不可能像 Prerender 時指定一個本地端的位置，因此要把 prerender 的環境也切出來，因此我們可以建立一個 `environment.ssr.ts` 來處理伺服器端地抓檔問題，並指定靜態檔案的來源：

```json
export const environment = {
  production: true,
  assetsUrl: 'http://localhost:3000/'
};
```

其他的 `environment.ts` 和 `environment.prod.ts` 則可以加上 `assetUrl: ''` 設定，來抓取相對路徑的資源，之後使用 HttpClient 的寫法就會改成：

```typescript;highlightLines=1:1:1:1;highlightLines=5:31:5:55
import { environment } from '../../environment';

...

posts$ = this.httpClient.get(`${environment.assetsUrl}assets/blog/posts.json`)
```

最後，當然還需要修改 `angular.json` 內的設定，讓我們在 prerender 時能換掉 `environment.ts`，主要內容如下：

```json;highlightLines=13:13:13:18;highlightLines=18:57:18:60;highlightLines=31:13:31:18;highlightLines=33:68:33:71
{
  ...
  "projects": {
    "ngx-universal-prerender-demo": {
      ...
      "architect": {
        ...
        "server": {
          ...
          "configurations": {
            "production": { ... },
            "development": { ... },
            "ssr": {
              "outputHashing": "media",
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.ssr.ts"
                }
              ]
            },
          },
          "defaultConfiguration": "production"
        },
        ...
        "prerender": {
          ...
          "configurations": {
            "production": { ... },
            "development": { ... },
            "ssr": {
              "browserTarget": "ngx-universal-prerender-demo:build:production",
              "serverTarget": "ngx-universal-prerender-demo:server:ssr"
            }
          },
          "defaultConfiguration": "production"
        }
      }
    }
  },
  "defaultProject": "ngx-universal-prerender-demo"
}

```

之後在 prerender 時先用 lite-server 將靜態伺服器打開後，執行 prerender 即可，當然也要記得改用 `ssr` 的相關設定 (或去改 `angular.json` 的 `defaultConfiguration` 也行)

```shell
npm run prerender -- --configuration ssr --routes-file post-routes.txt
```

## 準備 Prerender 需要的檔案

首先我們可以先準備多個 markdown 檔，並放在 `src/assets/blog` 內

{% asset_img 07.png %}

接著為了讓我們能更好的解析這些資料，再準備一個 `posts.json` 當作 metadata：

```json
[
  { "title": "文章 01", "file": "post-1.md", "slug": "post-1" },
  { "title": "文章 02", "file": "post-2.md", "slug": "post-2" },
  { "title": "文章 03", "file": "post-3.md", "slug": "post-3" },
  { "title": "文章 04", "file": "post-4.md", "slug": "post-4" }
]
```

## 撰寫資料抓取的 resolver

這裡我們撰寫了 3 個 resolver，第一個是進入文章首頁顯示抓取目前全部文章：

```typescript
@Injectable({ providedIn: 'root' })
export class PostsResolver implements Resolve<PostMeta[]> {
  constructor(private httpClient: HttpClient) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PostMeta[]> {
    return this.httpClient
      .get<PostMeta[]>(`${environment.assetsUrl}assets/blog/posts.json`)
      .pipe(catchError(() => of([])));
  }
}
```

第二個是進入文章頁面時，抓取文章的 markdown 檔案，並將內容轉為 HTML (使用 markdown-it 套件)

```typescript
@Injectable({ providedIn: 'root' })
export class PostResolver implements Resolve<string> {
  constructor(private httpClient: HttpClient) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> {
    return this.httpClient
      .get(
        `${environment.assetsUrl}assets/blog/${route.paramMap.get('slug')}.md`,
        { responseType: 'text' }
      )
      .pipe(
        map((markdown) => markdownIt().render(markdown)),
        catchError(() => {
          return of('404');
        })
      );
  }
}

```

最後一個是抓取文章標題用的，之後可以拿來更改網站的 `<title>` 內容，已得到更好的 SEO 效果。

接著在路由設定加上這幾個 resolver

```typescript;highlightLines=3:3:3:36;highlightLines=8:5:8:12
{
  path: '',
  resolve: { posts: PostsResolver },
  component: PostsComponent,
},
{
  path: 'post/:slug',
    resolve: { 
      post: PostResolver, 
      title: TitleResolver 
    },
  component: PostComponent,
}
```

{% note info %}

特地使用 resolver 在 Prerender 下最大的好處是，靜態檔案產生後，不會因為資料重新下載需要覆蓋而造成畫面閃爍

{% endnote %}

## 取得 resolver 的資料並顯示

在元件內，可以訂閱 `ActivatedRoute.data` 來拿到資料，例如：

```typescript
@Component({ ... })
export class PostComponent implements OnInit {
  content$ = this.route.data.pipe(
    map((data) => data.post),
    filter((data) => !!data),
    map((content) => this.domSanitizer.bypassSecurityTrustHtml(content))
  );

  title$ = this.route.data.pipe(map((data) => data.title || ''));

  constructor(
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private title: Title
  ) {}

  ngOnInit(): void {
    this.title$.subscribe((title) => {
      this.title.setTitle(title);
    });
  }
}
```

接著在 template 內顯示取得的資料，這沒有特別的地方：

```html
<div class="post-content" [innerHTML]="content$ | async"></div>
```

## 結果預覽

上面的程式看起來非常簡單，在一般使用 `npm start` 時啟動非 SSR 網站時也能正常運作，當要把所有頁面輸出成靜態頁面時，就可以用 prerender 輕鬆搞定。

```shell
npm run prerender -- --configuration ssr --routes-file post-routes.txt
```

最後當然是要預覽結果，有兩個方式可以確認：

1. 直接去產出目錄看原始碼
2. 跑一個伺服器確認效果

前面我們用了 lite-server 來跑模擬的伺服器，不過 lite-server 在目錄網址時不會提供裡面的 `index.html` 當作內容，因此我們可以自己建立一個伺服器來解決這個問題，先安裝一些套件：

```shell
npm i -D ts-node connect serve-static @types/node @types/connect @types/serve-static
```

接著建立一支伺服器程式 `ssr-preview.ts`：

```typescript
import * as connect from 'connect';
import * as serveStatic from 'serve-static';
import { join } from 'path';
// 靜態檔案路徑，請自行修改
const distFolder = join(process.cwd(), 'dist', 'ngx-universal-prerender-demo', 'browser');
connect()
  .use(serveStatic(distFolder))
  .listen(4001, () => console.log('Server running on 4001...'));
```

以及要給它使用的 `tsconfig.ssr-preview.json`：

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "commonjs"
  }
}
```

最後跑起來看看

```shell
npx ts-node --project .\tsconfig.ssr-preview.json .\ssr-preview.ts 
```

接著可以隨意瀏覽任一個頁面的原始碼，就可以發現內容都是被靜態產生，之後只要上傳到 GitHub Pages 之類的伺服器上就好啦！

# 本日小結

Angular Universal 現在已經簡單到不可思議了，想想過去要設定一堆東西，還有不少限制，現在則是功能完整，設定無腦。

而 Prerender 功能更是適用於一些重點在產生內容，不需要資料庫管理的情境，而且因為全部都是預先產生的靜態網頁，因此讀取速度肯定是飛快，更重要的是，不需要被 Scully、Hexo 這類的靜態網站產生器給限制住，可以完全從一個新的 Angular 專案開始打造，雖然還是有不少眉角要注意，但卻可以得到最大的彈性，無限制地揮灑創意，真的是太幸福啦！！

# 相關資源

* [Angular Universal](https://angular.io/guide/universal)
* [Prerender](https://angular.io/guide/prerendering)
* [scully.io](https://scully.io/)
* [Hexo](https://hexo.io)
