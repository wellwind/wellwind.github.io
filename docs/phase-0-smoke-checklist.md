# Phase 0 Smoke Test Checklist

Execute these journeys before and after significant refactors to ensure the baseline experience remains intact.

## Journey 1 – Blog landing and pagination
1. Visit `/blog`.
2. Confirm five posts render with title, summary, and tag chips.
3. Click the next page control and verify the URL updates with `?page=2` and new posts render.
4. Use the previous control to return to the first page.

## Journey 2 – Blog post detail
1. From the listing, open the most recent article.
2. Verify metadata (title, subtitle, publication date, tags) render above the article body.
3. Confirm the table of contents anchors scroll to sections.
4. Check that previous/next navigation links resolve and route correctly.

## Journey 3 – Search with keyword and filters
1. Navigate to `/query?q=Angular`.
2. Ensure only posts mentioning “Angular” appear and that result chips show `文章` as the type.
3. Append `&start=2024-01-01&end=2024-12-31` and verify the result count updates and date chips render.
4. Test taxonomy search via `/query?q=category:Frontend:Angular` and confirm only matching posts remain.

## Journey 4 – Category and tag listings
1. Visit `/blog/categories` and `/blog/tags` from the sidebar.
2. Check that counts display for each chip and that clicking a chip filters the listing to the selected taxonomy.
3. From the filtered view, open a post and ensure breadcrumb links return to the taxonomy page.

## Journey 5 – Layout and navigation shell
1. Toggle the sidebar and theme switcher, confirming the layout responds without reloading the page.
2. Navigate between `/blog`, `/blog/archives`, and `/query` ensuring the header and footer remain stable.
3. Verify the URL serializer keeps trailing slashes consistent when copying links from the address bar.
