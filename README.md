# Biru
Budget reporting

Todo:
- Grocery store receipt OCR
- sub-categories
- edit category
- edit description

Schema:
1. transactions
    a. id - text, primary key. SHA-256 hash of date + description + amount + type
    b. date - text
    c. description - text
    d. amount - number
    e. type - text. 'credit' or 'debit'
    f. account - text
    g. category - text