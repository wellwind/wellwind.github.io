# Phase 1：Shared Core 與契約落地計畫

## 目標
- 建立 `src/shared/core` 架構，收納跨切片共用的模型、日期工具與 Markdown 契約，並提供乾淨的公開 API。
- 建立 `src/shared/testing`，集中共用的 builders 與 mocks，以利後續各切片測試重用。
- 定義 `AnalyticsPort`、`PlatformPort`、`SeoMetaPort` 等跨功能介面，為後續功能切片鋪設穩定契約。

## 工作分解與狀態
- [x] 盤點並記錄現存跨切片模型與工具，整理移轉清單。
- [x] 建立 `shared/core` 目錄骨架與 `index.ts` 桶狀匯出，準備 `models/`、`markdown/`、`dates/`、`ports/` 子目錄。
- [x] 搬遷 `PostMeta`、分類/標籤型別至共享模型，並更新現有呼叫端引用。
- [x] 規劃 Markdown 與日期相關契約的遷移策略，並準備空殼模組待後續填補。
- [x] 建立 `shared/testing` 的 builders/mocks 架構，並將既有測試改用共用 `postMetaBuilder`。
- [x] 定義並匯出跨切片 ports 的介面與暫行實作。
- [x] 更新 `tsconfig` path alias 與相關建置腳本，確保新路徑可用。
- [x] 調整 `docs/clean-architecture-plan.md` 與其他文件，反映 Phase 1 的實作現況與剩餘工作。

## 測試策略
- 每完成一個主要子任務，至少執行 `npm run lint` 驗證程式碼靜態品質，必要時補跑 `npm run test` 確認回歸測試。
- 建立新的共用 builders 或 ports 後，新增或調整單元測試，確保行為維持正確。

## 風險與緩解
- **變更多點**：拆分提交，必要時提早提交 PR，避免超出 ±400 行限制。
- **匯入路徑錯誤**：調整完成後以 TypeScript 編譯與 lint 驗證，並透過 IDE/CI 觀察潛在錯誤。
- **測試資源遷移造成回歸**：每次替換測試 helper 後立即執行相關單元測試。

## 里程碑追蹤
- 2024-??-??：建立共享架構（進行中）。
- 2024-??-??：完成核心模型搬遷（未開始）。
- 2024-??-??：完成 ports 定義與共用測試資源（未開始）。

## 進度紀錄
- 2025-09-19：完成 `PostMeta` 模型搬遷與 `shared/core` 骨架建立，新增 `@shared/core`、`@shared/testing` path alias，並以 `postMetaBuilder` 取代部份測試中的臨時建構函式。已執行 `npm run lint` 與 `npm run test` 確認既有流程穩定，尚待定義跨切片 ports 與補齊 Markdown/日期契約實作，文件同步更新進行中。
- 2025-09-20：補齊 `AnalyticsPort`、`PlatformPort`、`SeoMetaPort` 介面與暫行實作，並提供對應的測試替身，準備後續切片改造時的依賴注入介面。
