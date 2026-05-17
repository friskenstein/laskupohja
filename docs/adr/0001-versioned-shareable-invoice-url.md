# Use a versioned shareable invoice URL payload

Shareable invoice URLs must reproduce the same printable invoice document, including invoice content, layout variant, and currency. We will encode that document selection as a single versioned payload query parameter instead of continuing to grow flat query parameters, accepting that URLs become less hand-editable in exchange for a testable parser and room for the invoice model to evolve.
