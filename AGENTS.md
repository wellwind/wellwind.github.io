# 協作指引

- 每次變更若累計 diff 大於 ±400 行，必須立即暫停後續開發，先提交 PR，並在文件中明確記錄尚未完成的事項。
- 所有已提交至版本庫的變更，都必須建立對應的 PR；未建立 PR 不得視為任務完成。

## Clean Architecture Migration TODO（請同步參考 `docs/clean-architecture-plan.md`）
- 當前優先事項：Phase 2 – Scaffold Feature Slices。
  - [ ] 依計畫建立 `blog`、`post-detail`、`search`、`taxonomy`、`layout` 切片骨架（含 domain/application/infrastructure/presentation）。
  - [ ] 將現有 TypeScript 型別與純函式搬移至各切片 `domain` 目錄，並調整匯入路徑使用切片本地或 `@shared/core` 別名。
  - [ ] 建立切片專屬單元測試，確保搬遷過程行為被守護。
- 未來變更若影響計畫，需同步更新 `docs/clean-architecture-plan.md`。
