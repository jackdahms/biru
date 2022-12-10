import sqlite3

con = sqlite3.connect('transactions.db')
cur = con.cursor()

cur.execute('''DROP TABLE IF EXISTS transactions''')

cur.execute('''
    CREATE TABLE transactions(
        id TEXT PRIMARY KEY,
        date TEXT,
        description TEXT,
        amount NUMBER,
        type TEXT,
        account TEXT,
        category TEXT
    )
''')