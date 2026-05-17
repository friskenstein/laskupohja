# Invoice Rebuild PRD

## Problem Statement

Laskupohja currently creates printable invoice documents, but the code is organized around Svelte components and flat route state rather than the invoice domain. Invoice content, layout selection, payment logic, URL persistence, calculations, and barcode rendering are coupled enough that extending the app is risky. The rebuild should make the app modular, testable, and open to new invoice layouts or payment capabilities while preserving the currently implemented printable document structures.

## Solution

Rebuild the app around the domain language captured in `CONTEXT.md`: shared **Invoice Content**, selectable **Layout Variants**, and **Shareable Invoice URLs** that reproduce an exact **Invoice Document Selection**. The app will support the two currently implemented layout variants: Finnish bank transfer with barcode and international invoice with bank information listed only. The editing interface can be redesigned freely, but the printable invoice document structure should remain close to the current output unless deliberately changed.

The rebuild should use a fresh internal structure rather than carefully preserving the current component API. The URL API may change completely. Old flat query parameter bookmarks are allowed to break.

## User Stories

1. As an invoice creator, I want to enter invoice content once, so that I can render it through the supported invoice layouts.
2. As an invoice creator, I want a Finnish bank transfer layout with the current printable payment slip and barcode structure, so that Finnish invoices remain usable.
3. As an invoice creator, I want an international invoice layout with listed bank information, so that I can create non-Finnish invoice documents.
4. As an invoice creator, I want the invoice currency saved in the URL, so that a shared URL reproduces the same printable document.
5. As an invoice creator, I want the selected layout variant saved in the URL, so that a shared URL reproduces the same printable document.
6. As an invoice creator, I want to edit incomplete invoice content without constant blocking validation, so that the form does not fight me while I work.
7. As an invoice creator, I want to save or share incomplete invoice content, so that work in progress is not lost.
8. As an invoice creator, I want warnings before printing invalid content, so that I can fix issues without being blocked by the app.
9. As an invoice creator, I want payment artifact actions to require valid payment data, so that malformed Finnish bank barcodes are not copied or rendered as valid.
10. As an invoice creator, I want totals and VAT breakdowns to be calculated consistently, so that the printed document is trustworthy.
11. As an invoice creator, I want calendar dates to behave like dates rather than time-zone-specific instants, so that due dates do not shift unexpectedly.
12. As an invoice creator, I want payment details preserved when switching layout variants, so that changing layouts does not discard data I may need later.
13. As a future maintainer, I want pure invoice modules with stable interfaces, so that calculations, validation, URL parsing, and payment logic can be tested without rendering Svelte.
14. As a future maintainer, I want Svelte-specific code isolated to document components and UI adapters, so that a future command line interface can reuse the invoice core.
15. As a future maintainer, I want runtime parsing at external boundaries, so that malformed URL payloads do not silently become invalid application state.
16. As a future maintainer, I want layout metadata separate from layout components, so that non-Svelte consumers can understand available layout variants.
17. As a future maintainer, I want barcode payload generation separate from barcode SVG rendering, so that payment logic remains testable.

## Implementation Decisions

- Use the domain vocabulary in `CONTEXT.md` as the canonical language for code and documentation.
- Rebuild around a shared **Invoice Content** model and a separate **Invoice Document Selection** containing content, layout variant, and currency.
- Use layout-first architecture. **Layout Variants** are the user-facing extension point, and **Payment Capabilities** sit underneath them.
- Initial layout variants are `finnish-bank-transfer` and `international-invoice`.
- Finnish bank barcode v5 and international RF reference support are out of scope for this rebuild.
- Use a versioned single-payload shareable URL format. Do not support old flat query parameter URLs.
- Use Zod for boundary parsing, especially shareable invoice URL payload parsing. Business validation remains explicit content rules and layout requirements.
- Keep editable invoice content permissive while the user types. Validation determines print/payment readiness later.
- Store editable money inputs as strings at the boundary, then parse and calculate using integer minor units.
- Calculate VAT breakdown as a shared domain result available to every layout.
- Represent invoice dates and due dates as local date values, not JavaScript `Date` objects in the domain model.
- Use a shared `Party` model for seller and buyer. Party identifiers represent VAT numbers, business IDs, and similar printed identifiers.
- Preserve payment fields when switching layout variants, even if the selected layout does not use every field.
- Keep `jsbarcode` as a barcode SVG rendering dependency, but isolate it to a UI adapter. Payment modules generate and validate payload strings.
- Preserve the current printable document structure for the two supported layouts. The editing interface may be redesigned.
- Upgrade dependencies as part of the rebuild, including moving to Svelte 5. Use the official migration path where useful, but the component rewrite can use Svelte 5 style directly.
- Plan for a future CLI by keeping core invoice modules framework-independent.

Target module structure:

```txt
src/lib/invoice/
  domain/
    types.ts
    defaults.ts
  calculation/
    money.ts
    totals.ts
    dates.ts
  validation/
    contentRules.ts
    layoutRequirements.ts
  serialization/
    invoiceUrl.ts
    schemas.ts
  payment/
    references/finnishReference.ts
    finnishBankBarcode.ts
  layouts/
    registry.ts
    finnish-bank-transfer/
      layout.ts
      Document.svelte
    international-invoice/
      layout.ts
      Document.svelte
  ui/
    fields/
    sections/
    BarcodeSvg.svelte
```

Everything outside `.svelte` files and `ui/` should be browser-safe and CLI-safe TypeScript.

## Testing Decisions

- Prioritize pure domain, serialization, payment, and validation tests before UI tests.
- Good tests should cover external behavior and domain contracts, not internal implementation details.
- Test shareable URL parsing and encoding for valid versioned payloads and malformed payload handling.
- Test money parsing, line totals, invoice totals, and VAT breakdown using minor units.
- Test local date due-date calculation, including cases that could expose timezone off-by-one errors.
- Test Finnish reference checksum behavior.
- Test Finnish bank barcode v4 payload generation for valid data and invalid-data handling.
- Test layout requirements for `finnish-bank-transfer` and `international-invoice`.
- Add browser or component smoke coverage only after the pure modules are in place, especially for barcode SVG rendering and preserved printable document structure.

## Out of Scope

- Backward compatibility with old flat query parameter URLs.
- Finnish bank barcode v5.
- International RF reference support.
- Adding a command line interface during this rebuild.
- Adding more layout variants beyond `finnish-bank-transfer` and `international-invoice`.
- Reworking the printable invoice document design beyond what is necessary for the rebuild.

## Further Notes

- Architectural decisions already recorded:
  - `docs/adr/0001-versioned-shareable-invoice-url.md`
  - `docs/adr/0002-calculate-money-in-minor-units.md`
  - `docs/adr/0003-break-old-flat-invoice-urls.md`
- The next step after this PRD can be implementation directly, or issue creation using the repo's GitHub issue workflow.
