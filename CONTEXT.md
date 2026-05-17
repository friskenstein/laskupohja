# Laskupohja

Laskupohja creates printable invoice documents from invoice content. The same invoice content can be rendered through different invoice layouts.

## Language

**Invoice Content**:
The invoice information independent of presentation.
_Avoid_: State, form state, invoice draft

**Invoice Identity**:
The invoice number, invoice date, and payment term that identify and time the invoice.

**Invoice Document**:
The rendered printable invoice produced from invoice content and an invoice layout.
_Avoid_: Draft

**Invoice Document Selection**:
The invoice content, layout variant, and currency needed to reproduce a specific printable invoice document.

**Invoice Layout**:
A presentation format used to render an invoice document.
_Avoid_: Language

**Layout Variant**:
An invoice layout specialization that includes or omits specific payment capabilities.
_Avoid_: Profile

**Layout Requirement**:
A field or validation rule required by an invoice layout.

**Content Rule**:
A validation rule that applies to invoice content regardless of layout.

**Editable Invoice Content**:
Invoice content that may be incomplete or invalid while the user is still editing.

**Payment Capability**:
A payment artifact or payment method an invoice layout can support.

**Invoice Line**:
One billable row with quantity, unit, unit price, and VAT rate.
_Avoid_: Item, row

**Line Amount**:
The calculated net, VAT, or gross amount for an invoice line.

**VAT Breakdown**:
Invoice totals grouped by VAT rate.

**Seller**:
The party issuing the invoice and receiving payment.
_Avoid_: Company, issuer

**Buyer**:
The party expected to pay the invoice.
_Avoid_: Payer, recipient, customer

**Payment Details**:
The bank and reference information needed to pay an invoice.

**Party**:
A seller or buyer named on the invoice.

**Party Identifier**:
A business, tax, or VAT identifier printed for a party.
_Avoid_: Company Y-tunnus, company VAT, payer VAT

**Postal Address**:
The address printed for a party.

**Contact Details**:
The phone, email, and website information printed for a party.

**Payment Reference**:
The reference information used to match a payment to an invoice.

**Payment Term**:
The number of days from invoice date to due date.

**Due Date**:
The date payment is due.

**Local Date**:
A calendar date without time zone or time-of-day meaning.
_Avoid_: JavaScript Date

**Minor Unit Amount**:
A monetary amount represented in the smallest unit of the invoice currency, such as cents.
_Avoid_: Float amount

**Finnish Reference Number**:
The national Finnish reference number including its checksum.
_Avoid_: Reference

**Finnish Bank Barcode**:
The machine-readable Finnish payment code printed on Finnish invoice documents.
_Avoid_: Barcode

**Shareable Invoice URL**:
A URL that contains enough state to reproduce the same printable invoice document.
_Avoid_: Flat query params

**Boundary Parsing**:
Runtime parsing of external data before it enters the invoice model.

## Relationships

- **Invoice Content** contains one **Seller**, one **Buyer**, one or more **Invoice Lines**, and **Payment Details**.
- **Invoice Content** contains **Invoice Identity**, **Seller**, **Buyer**, one or more **Invoice Lines**, **Payment Details**, and an invoice note.
- **Editable Invoice Content** can be saved to a **Shareable Invoice URL** even when it is not ready to print or pay.
- **Invoice Content** combined with an **Invoice Layout** produces one **Invoice Document**.
- Existing printable **Invoice Document** structure should be preserved unless deliberately changed.
- An **Invoice Document Selection** contains **Invoice Content**, a **Layout Variant**, and the invoice currency.
- A **Shareable Invoice URL** encodes an **Invoice Document Selection**.
- **Boundary Parsing** protects the app from malformed shareable invoice URL payloads.
- Old flat query parameter URLs are not part of the supported **Shareable Invoice URL** contract.
- A **Seller** and a **Buyer** are both **Parties**.
- A **Party** can have a **Postal Address** and **Contact Details**.
- A **Party** can have one or more **Party Identifiers**.
- **Payment Details** can include a **Payment Reference**.
- **Payment Details** are preserved when switching **Layout Variants**, even if the newly selected variant does not use every payment field.
- An **Invoice Layout** can define **Layout Requirements** and **Payment Capabilities** without owning separate invoice content.
- A **Layout Variant** can include or omit a **Payment Capability** while preserving the same core **Invoice Layout** family.
- **Invoice Layouts** are rendered by layout-specific document components that can compose shared invoice sections.
- Core invoice modules should be reusable outside Svelte so a future command line interface can reuse parsing, validation, calculations, payment logic, and layout metadata.
- Svelte-specific code belongs in invoice document components and user interface adapters.
- A **Content Rule** applies before layout-specific **Layout Requirements**.
- Validation determines whether **Editable Invoice Content** is ready to print or pay; validation does not need to run immediately while the user types.
- Runtime schemas are used for **Boundary Parsing**, while business validation remains explicit **Content Rules** and **Layout Requirements**.
- User interface components can display validation results, but they do not define **Content Rules** or **Layout Requirements**.
- Sharing a **Shareable Invoice URL** should not be blocked by validation because it preserves work in progress.
- Printing an **Invoice Document** can warn about validation problems but should not be blocked.
- Payment artifact actions, such as copying or rendering a **Finnish Bank Barcode**, require valid payment data.
- **Finnish Bank Barcode** payload generation belongs to payment logic; barcode SVG rendering is a user interface adapter concern.
- **Line Amounts** and invoice totals are calculated as **Minor Unit Amounts** after parsing editable values.
- A **VAT Breakdown** is calculated from all **Invoice Lines** and is available to every **Invoice Layout**.
- Invoice dates and **Due Dates** are **Local Dates**.
- A **Payment Term** determines the **Due Date** from the invoice date.
- A **Finnish Bank Barcode** includes the payable amount, due date, IBAN, and **Finnish Reference Number**.

## Example dialogue

> **Dev:** "Can the same **Invoice Content** render both Finnish and international **Invoice Documents**?"
> **Domain expert:** "Yes. The content should stay the same; the **Invoice Layout** decides which payment fields and labels are shown."

## Flagged ambiguities

- "payer" and "recipient" appeared in the code and UI for the party expected to pay; resolved: the canonical term is **Buyer**.
- "language" appeared in the code for Finnish versus international rendering; resolved: this is an **Invoice Layout** decision, not just translation.
- Finnish and international invoice rendering should share **Invoice Content**; layout-specific validation belongs to **Layout Requirements**.
- Layout-specific payment differences are represented as **Layout Variants**, such as a Finnish layout with bank transfer details or a Finnish layout without payment details.
- Existing flat URL parameters may be broken by the rebuild; the supported URL format is the versioned **Shareable Invoice URL** payload.
- The editing interface can be redesigned freely, but printable **Invoice Document** structure is compatibility-sensitive.
- The initial rebuild supports two **Layout Variants**: Finnish bank transfer with barcode, and international invoice with bank information listed only.
- Finnish bank barcode v5 and international RF reference support are future work, not part of the initial rebuild.
