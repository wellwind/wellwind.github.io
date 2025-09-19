# Clean Architecture Modernization Plan

## Overview
This document outlines the Clean Architecture redesign for the blog platform with an explicit focus on **feature-based slicing**. Each vertical slice (blog listing, post detail, search, taxonomy, layout) owns its domain, application, infrastructure, and presentation pieces so teams can evolve functionality independently while keeping shared rules consistent across the project.

## Clean Architecture Primer
Clean Architecture separates core business rules from infrastructure, frameworks, and presentation. The dependency rule still applies—source code dependencies point inward—but the project will enforce it **inside every feature slice** instead of by global layers only.

### Core Principles
1. **Feature-first boundaries** – Group related behavior (e.g., blog listing) together under one directory with its domain, use cases, and UI artifacts.
2. **Dependency Rule** – Inside each feature, presentation depends on application, which depends on domain abstractions, which rely on shared primitives. No Angular/framework references in domain code.
3. **Replaceability & Testability** – Domain/application remain pure TypeScript. Infrastructure adapters can be swapped without touching business rules. Feature slices ship their own targeted tests.
4. **Explicit Ports** – Each feature declares the adapters it needs (`PostRepository`, `AnalyticsPort`, etc.) and infrastructure satisfies them per runtime (browser, SSR).
5. **Shared Kernel** – Cross-cutting primitives (date utilities, Markdown contracts) live in `shared/core` so features can reuse them without tighter coupling.

### Target Layers Inside Each Feature
| Layer | Responsibilities | Typical Contents |
| --- | --- | --- |
| **Domain** | Entities, value objects, domain services specific to the feature. | `Post`, `PostSummary`, pagination/search rules, Markdown parsing policies. |
| **Application (Use Cases)** | Use cases orchestrating domain rules, DTOs, ports needed from infrastructure. | `ListPosts`, `SearchPosts`, `LoadPostDetail`, `ListTaxonomy` commands & handlers. |
| **Infrastructure** | Adapters that implement feature ports (HTTP, TransferState, analytics, storage). | `HttpPostRepository`, `MarkdownContentAdapter`, `FaroAnalyticsAdapter`. |
| **Presentation** | Angular components, resolvers, facades, signals, view models. | `BlogPostsComponent`, `SearchFacade`, route resolvers. |

## Feature Slices & Ownership
| Feature | Scope | Key Responsibilities |
| --- | --- | --- |
| **blog** | Landing page, pagination, archives | Fetch and paginate posts, surface SEO metadata, emit analytics for list impressions. |
| **post-detail** | Individual article experience | Retrieve Markdown, parse meta, render content, trigger reading analytics. |
| **search** | Keyword/date/category/tag search | Interpret query params, orchestrate search, return ranked results. |
| **taxonomy** | Category & tag listings | Aggregate posts per category/tag, expose counts, support tag cloud UI. |
| **layout** | Shell, navigation, theming | Manage theme preference, responsive layout state, header/footer interactions. |
| **shared** | Cross-cutting utilities | Shared core primitives, platform adapters, testing helpers, design system pieces. |

Each slice adheres to the same Clean Architecture layering but can evolve independently (e.g., introduce caching to `search` without touching `blog`).

## Proposed Folder Structure (Feature-Sliced)
```
src/
├── features/
│   ├── blog/
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── presentation/
│   ├── post-detail/
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── presentation/
│   ├── search/
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── presentation/
│   ├── taxonomy/
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── presentation/
│   └── layout/
│       ├── domain/
│       ├── application/
│       ├── infrastructure/
│       └── presentation/
├── shared/
│   ├── core/                # Cross-feature entities, value objects, utils
│   ├── infrastructure/      # Platform abstractions (window, storage, meta)
│   ├── ui/                  # Design system components usable by any feature
│   └── testing/             # Builders, mocks, harnesses
├── app/                     # Root providers, routing, bootstrap composition
└── environments/
```

**Notes**
- Feature directories follow the same internal layering. Tests live beside the code they exercise (`domain/__tests__`, `application/__tests__`, etc.).
- Shared layer provides primitives only—features remain the owners of actual use cases and presentation.
- Angular-specific providers are configured at the feature entry point (e.g., `features/blog/presentation/blog.routes.ts`) and registered in the root composition (`app/app.config.ts`).

## Example: Search Feature Flow
1. **Presentation** – `features/search/presentation/query.component.ts` reads router params and calls `SearchFacade.search(query)`. The facade exposes signals for loading state and results.
2. **Application Use Case** – `SearchPostsUseCase` lives in `features/search/application/use-cases`. It accepts a `SearchPostsCommand`, invokes domain services, and coordinates pagination. Ports required: `PostRepository`, `AnalyticsPort`.
3. **Domain Services** – Located under `features/search/domain/services`, pure functions such as `filterPosts`, `rankMatches`, and `buildSearchSummary` operate on entities defined in the same slice or in `shared/core`.
4. **Infrastructure Adapter** – `features/search/infrastructure/http-post.repository.ts` implements `PostRepository` using Angular `HttpClient`, `TransferState`, and caching strategies. Alternative adapters (e.g., in-memory fixture for tests) live alongside it.
5. **Shared Utilities** – Markdown parsing or date helpers reused across slices come from `shared/core`. The dependency direction remains inward (feature domain depends on shared primitives, not vice versa).
6. **Presentation Rendering** – The facade returns a `SearchResultVm` that the component renders. Analytics signals go through `AnalyticsPort`, allowing SSR and browser to provide different adapters.

## Refactor Plan (Feature-by-Feature)
### Phase 0 – Baseline & Safety Nets ✅ Completed

#### Plan
1. Baseline the current behaviour for blog, post detail, search, taxonomy, and layout slices so later phases know the expected outputs.
2. Add automated regression coverage around search, pagination, Markdown parsing, and routing helpers to guard critical flows.
3. Document and rehearse smoke scenarios for the main user journeys to provide a quick confidence check before/after refactors.

#### Detailed Execution Checklist (繁體中文)
- ✅ **建立當前行為基準**：逐一操作 blog、post detail、search、taxonomy、layout 五個切片並記錄畫面狀態、資料來源與路由流程，彙整於 [`docs/phase-0-baseline.md`](./phase-0-baseline.md)。
- ✅ **落實回歸測試安全網**：為搜尋、分頁、Markdown 解析與路由輔助函式撰寫測試，覆蓋 `searchPosts`、`searchPostsByDateRange`、`getPagePosts`、`findPosts`、`route-utils`、`parseMarkdownMeta` 等核心流程。
- ✅ **制定煙霧測試腳本**：依照基準流程拆解高階使用者旅程並整理為 [`docs/phase-0-smoke-checklist.md`](./phase-0-smoke-checklist.md)，提供後續 refactor 前後的快速驗證清單。

#### Status (2025-09-19)
- Baseline behaviour captured in [`docs/phase-0-baseline.md`](./phase-0-baseline.md) covering routing flows and feature expectations.
- Regression tests added for `searchPosts`, `searchPostsByDateRange`, `getPagePosts`, `findPosts`, `route-utils`, and `parseMarkdownMeta` to lock down search, pagination, Markdown parsing, and routing helpers.
- Smoke checklist scripted in [`docs/phase-0-smoke-checklist.md`](./phase-0-smoke-checklist.md) and ready for execution during subsequent phases.
- Added a Node-driven Jasmine runner (`npm test`) so the regression suite runs in environments without a local Chrome binary.

#### Follow-up Items
- [ ] Capture analytic event baselines (Faro) while running the smoke checklist to compare against future instrumentation changes.
- [ ] Automate the smoke journeys via Playwright once feature slices are scaffolded, reusing the manual checklist as the scenario source.
- [ ] Wire the Node-driven Jasmine runner into CI after confirming compatible Node and dependency versions in the target environment.

### Phase 1 – Shared Core & Contracts
- ✅ 建立 `shared/core` 骨架並搬遷 `PostMeta`／分類／標籤型別，新增 `@shared/core` 與 `@shared/testing` path alias 供程式與測試共用。
- ✅ 在 `shared/testing` 提供 `postMetaBuilder`，開始以共用 builder 取代既有測試內的臨時工廠函式。
- ✅ 定義跨切片 ports（`AnalyticsPort`、`PlatformPort`、`SeoMetaPort`）並提供暫行實作；後續將補齊 Markdown／日期契約與其適配層。

### Phase 2 – Scaffold Feature Slices
- Create directory skeletons for `blog`, `post-detail`, `search`, `taxonomy`, `layout` mirroring the proposed structure.
- Move existing TypeScript types and pure helpers into the appropriate `domain` folders; adjust imports to use feature-local paths or `shared/core`.
- Establish feature-specific unit test suites to guard migrations.
- ✅ Promoted the cross-platform detection service to `shared/infrastructure/platform` and exposed it through the new `@shared/infrastructure` barrel to eliminate lingering `site-common` imports.

### Phase 3 – Migrate Search Slice
- Relocate `search-posts.ts` logic into `features/search/domain/services` with updated types from `shared/core`.
- Implement `SearchPostsUseCase` and corresponding ports in `features/search/application`.
- Wrap current HTTP + TransferState logic as `features/search/infrastructure/http-post.repository.ts` implementing the new `PostRepository` port.
- Refactor `QueryComponent` into `features/search/presentation` consuming the facade/use case.

### Phase 4 – Migrate Blog & Post Detail Slices
- Convert `BlogPostsComponent`, pagination helpers, and resolvers into `features/blog/presentation` and `features/blog/application`.
- Split `SitePostService` responsibilities: meta aggregation into `features/blog/domain/services`, HTTP concerns into `features/blog/infrastructure/http-post.repository.ts`.
- Move `BlogContentResolve`, Markdown parsing, and HTML transformation into `features/post-detail` layers (domain for parsing policies, infrastructure for adapters).
- Update routing to load new feature entry points.

### Phase 5 – Migrate Taxonomy & Layout Slices
- Aggregate category/tag logic into `features/taxonomy` domain/services; expose use cases for listing and counts.
- Create `LayoutFacade` in `features/layout/application`, move theme preference storage into infrastructure implementing `ThemePreferencePort`.
- Ensure navigation tracking, SEO updates, and analytics route events use shared ports and live within layout or blog slices where appropriate.

### Phase 6 – Composition Root & Cleanup
- Update `app/app.config.ts`, `main.ts`, and SSR bootstrap files to register feature providers and bind ports to concrete adapters (browser vs. server implementations).
- Remove deprecated services/utilities, replace imports with new feature paths (`@features/blog/...`, `@shared/core/...`).
- Run the full automated test matrix (unit, integration, SSR smoke) and complete manual regression testing.

## Risks and Mitigations
- **Risk:** Features accidentally depend on each other’s internals.  
  **Mitigation:** Export only public APIs via feature `index.ts` files; enforce lint rules preventing cross-feature deep imports.
- **Risk:** Refactor introduces regressions while slices are half migrated.  
  **Mitigation:** Ship each feature slice behind guards (e.g., toggles or staged routes) and maintain dual adapters until confidence is high.
- **Risk:** Infrastructure duplication across slices.  
  **Mitigation:** Promote common adapters to `shared/infrastructure` once used by more than one feature while keeping feature-specific wiring local.

## Definition of Done
- Every feature directory owns its domain/application/infrastructure/presentation code and exposes a focused public API.
- Domain and application layers contain no Angular or runtime-specific imports; tests cover critical rules within each slice.
- Infrastructure adapters satisfy declared ports for both browser and SSR environments.
- Composition root wires adapters per feature, and presentation components depend solely on facades/use cases within their slice.
- Documentation (this plan) stays updated when new features or shared utilities are introduced.
