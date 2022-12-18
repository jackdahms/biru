# Biru
Budget reporting

Todo:
- button pull transactions from mint
- set transaction date to first and last of current month on initial load

- arrow buttons to adjust months
- Summary displays for start date's month

- credits
- hide/check all
- subcategory management
- Summary respects selected dates, not just months
    - Averages shown per month?
- budget bars
- Review budgets over time
- Grocery store receipt OCR
- sub-categories
- edit category
- edit description
- Sanitize start and end in /transactions

Schema:
1. transactions
    a. id - text, primary key. SHA-256 hash of date + description + amount + type
    b. date - text
    c. description - text
    d. amount - number
    e. type - text. 'credit' or 'debit'
    g. category - text
    f. account - text


