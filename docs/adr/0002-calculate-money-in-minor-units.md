# Calculate money in minor units

Invoice users edit amounts as strings, but calculation code will parse monetary values once and calculate line amounts, VAT, and totals as integer minor units. This avoids floating point rounding errors in invoice totals and VAT breakdowns, at the cost of a slightly more explicit calculation layer.
