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
### Phase 0 – Baseline & Safety Nets
- Add regression tests for current behavior (search, pagination, Markdown parsing, routing flows).
- Capture smoke scenarios for major features (blog index, post detail, taxonomy, search, layout interactions).

### Phase 1 – Shared Core & Contracts
- Create `shared/core` with existing `PostMeta`, `Category`, `Tag`, date utilities, Markdown parsing contracts.
- Introduce testing builders/mocks in `shared/testing` to support upcoming migrations.
- Define cross-feature ports (`AnalyticsPort`, `PlatformPort`, `SeoMetaPort`) in `shared/core/ports` so features can consume them consistently.

### Phase 2 – Scaffold Feature Slices
- Create directory skeletons for `blog`, `post-detail`, `search`, `taxonomy`, `layout` mirroring the proposed structure.
- Move existing TypeScript types and pure helpers into the appropriate `domain` folders; adjust imports to use feature-local paths or `shared/core`.
- Establish feature-specific unit test suites to guard migrations.

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
