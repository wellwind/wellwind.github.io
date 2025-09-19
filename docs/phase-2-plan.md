# Phase 2 Implementation Plan

## Goals
- Introduce a feature-sliced architecture for core blog functionality.
- Promote reusable primitives into the shared core library.
- Begin migrating existing domain logic into feature-specific homes while keeping tests green.

## Tasks
1. **Scaffold feature directories**
   - Create `src/features` with subfolders for `blog`, `post-detail`, `search`, `taxonomy`, and `layout`.
   - Inside each feature, add `domain/`, `application/`, `infrastructure/`, and `presentation/` directories plus a local `index.ts` to re-export public APIs.
   - Update TypeScript path mappings to support the `@features/*` alias family.

2. **Promote shared primitives**
   - Move generic helpers such as `slugify` into `shared/core` and re-export them through the shared barrel.
   - Relocate shared markdown contracts (e.g., `MarkdownMeta`) if they are referenced across features.

3. **Blog domain migration**
   - Relocate `find-posts.ts` and `get-page-posts.ts` (and their specs) into `features/blog/domain/services/`.
   - Update blog components/resolvers to import from the new feature alias.
   - Ensure tests continue to cover the moved services.

4. **Search domain migration**
   - Move `search-posts.ts` and its tests into `features/search/domain/services/`.
   - Update lazy imports within layout/query components to resolve via the feature alias.

5. **Post-detail domain migration**
   - Move markdown parsing/transform helpers and models into `features/post-detail/domain`.
   - Expose the required API surface through feature barrels and update consumers.

6. **Taxonomy & layout groundwork**
   - Move pure types for layout/theme selection into `features/layout/domain/models/`.
   - Add placeholder domain directories for taxonomy helpers to prepare for future migrations.

7. **Clean up legacy aliases**
   - Remove or repoint the `site-utils` alias once all consumers migrate to shared/feature barrels.
   - Replace remaining relative imports in `site-common` with shared helpers.

8. **Verification**
   - Run the regression suite (`npm test`) after each migration batch.
   - Document the final layout and update architecture notes.
