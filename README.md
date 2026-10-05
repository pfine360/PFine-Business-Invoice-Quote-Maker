# PFine Point of Sale System

PFine Point of Sale System is an offline-first Electron desktop app for products, services, batch stock tracking, staff accounts, customers, invoices, quotations, receipts, delivery notes, and local print/PDF output.

## Current Desktop Wrapper

- Wrapper: `Electron`
- Source entry: `electron/main.js`
- Desktop build command: `npm run desktop:dist`
- Current build output path: `dist-desktop-stock-staff-licensed-pos`

## What This Version Tracks Locally

- Store/business profile
- Regional settings and currency labels
- Owner-managed licence-ready edition state
- Employees and current cashier session
- Customers
- Products and services
- Product batches / stock lots
- Stock movement ledger
- Cart / draft document
- Transactions and payment records
- Receipts, invoices, quotations, and delivery notes
- Related document links

## Main Workflow

1. Save the store and regional settings.
2. Add at least one staff account and sign in with that account.
4. Add customers.
5. Add products or services.
6. Add stock batches for tracked products.
7. Add products to the cart or add custom rows manually.
8. Choose the document type:
   `Receipt`, `Invoice`, `Quotation`, or `Delivery Note`
9. Select the customer and complete payment and delivery details.
10. Save the transaction locally.
11. Print or save the selected document as PDF.

## Batch Tracking

Tracked products can have multiple active batches.

The app currently:

- stores batch number, dates, quantities, prices, supplier, notes, and active status
- calculates total available stock from active batches
- deducts stock using FIFO by default
- allows a manual batch selection per cart row
- records stock movement entries for stock-in, sale, adjustment, and sale-cancelled events

Example:

- 12 batches x 12 units each = 144 total stock
- selling 3 units reduces tracked stock to 141 when sufficient stock is available

## Navigation Layout

The app is organised into separate navigation sections:

- Dashboard
- POS Cart
- Products
- Stock & Batches
- Customers
- Staff
- Settings

This keeps the cart, product management, staff accounts, stock management, and business settings separated instead of mixing them in one long screen.

## Staff / Cashier Tracking

- Staff use local account sessions based on employee code and access code.
- A current cashier or employee session must exist before saving a transaction.
- The current employee is attached automatically to each saved transaction.
- Receipts show cashier / served-by details.
- Invoices and quotations show prepared-by / served-by details.
- Delivery notes show delivered-by and received-by details where entered.

## Documents

### Receipt

- receipt number
- date
- customer
- item lines
- amount received
- amount paid
- change given
- balance due if still outstanding
- payment method and reference
- cashier / served by

### Invoice

- invoice number
- date
- due date
- customer
- item lines
- payment status
- amount received / amount paid
- balance due
- payment details
- served by / prepared by

### Quotation

- quotation number
- date
- valid until
- customer
- item lines
- quotation total
- prepared by
- terms and acceptance wording

### Delivery Note

- delivery note number
- date
- related document reference
- customer / delivery address
- quantity ordered
- quantity delivered
- delivered by / received by
- optional pricing based on the `Show prices on delivery note` setting

## Owner-Managed Licence Foundation

This phase adds a practical licence-ready structure with honest limits, but it is no longer exposed in the normal client-facing navigation.

Included edition states:

- Demo
- Starter POS
- Professional POS
- Custom Branded POS
- Hosted Online POS

Important limitations:

- local/manual licence state is not a secure global licensing solution by itself
- owner-only local licence access is hidden from normal app clients and staff navigation
- manual key entry is suitable only as an early direct-sales foundation
- a signed offline licence file is recommended next
- a real online activation server is recommended for serious international sales

Owner access note:

- the owner licence panel is hidden from normal navigation
- it can be opened locally by the app owner with `Ctrl+Shift+O`

## Hosted-Ready Status

Hosted Online POS is not complete in this phase.

This release only prepares the roadmap/foundation for later work such as:

- user accounts
- server database
- cloud sync
- online backup
- roles and permissions
- subscription billing
- server-side licence activation
- security hardening

The current source is being shaped so a later hosted edition can support larger business networks more safely, but this desktop build does not claim real online access, shared live sync, or central server deployment yet.

## Print / Save PDF

`Print / Save PDF` opens the desktop print dialogue for the selected document.

If the desktop app cannot open the printer list, it falls back to a safe `Save as PDF` dialogue instead of stopping with a printer enumeration failure.

Print output hides:

- dashboard controls
- forms
- buttons
- history/sidebar controls
- licence/package editing screens

Print output shows only the selected business document.

## Storage Approach

This version uses local browser/Electron storage through `localStorage`.

That is acceptable for this offline-first phase, but for larger long-term data volumes, IndexedDB is the safer next-phase upgrade for:

- larger transaction histories
- larger customer lists
- larger product/batch ledgers
- better resilience for heavier local datasets

## Current Scope Exclusions

- no cloud sync
- no online login
- no payment gateway
- no remote licence server
- no server database
- no multi-user online roles
- no hosted online deployment in this phase

## Manual Test Steps

1. Open the fixed desktop app.
2. Add an employee/cashier.
3. Select the current cashier session.
4. Add a product.
5. Add 12 batches with quantity 12 each, or simulate equivalent batch entries.
6. Confirm total stock shows 144.
7. Add a customer.
8. Add 3 units to the cart.
9. Save a receipt or paid invoice.
10. Confirm stock reduces to 141.
11. Confirm a stock movement entry exists.
12. Confirm the receipt shows amount received, change/balance, and cashier.
13. Create an invoice with partial payment and confirm balance due.
14. Create a quotation and confirm prepared-by wording.
15. Create a delivery note and confirm delivered-by / received-by fields and the Show Prices toggle.
16. Clear the cart and confirm it resets after confirmation.
17. Check history and related document links.
18. Open the hidden owner panel with `Ctrl+Shift+O` and test the licence state in Demo mode.
19. Click Print / Save PDF and confirm no printer enumeration failure stops the workflow.
20. Close and reopen the app and confirm local data persists.
