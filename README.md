# Biru
Budget reporting

Todo:
- arrow buttons
- pie chart
- category dropdowns
- pull transactions from mint

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

    
"{% for transaction in transactions %}
                <tr>
                    <td>{{ transaction[1] }}</td>
                    <td>{{ transaction[2] }}</td>
                    <td>{{ transaction[3] }}</td>
                    <td>{{ transaction[4] }}</td>
                    <td>{{ transaction[5] }}</td>
                    <td>{{ transaction[6] }}</td>
                </tr>
            {% endfor %}"