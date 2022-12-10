import csv
import hashlib
import os
import sqlite3

con = sqlite3.connect('transactions.db')
cur = con.cursor()

data = []
expected_columns = ['Date', 'Description', 'Original Description', 'Amount', 'Transaction Type', 'Category', 'Account Name', 'Labels', 'Notes']
filepaths = ['mint transactions/' + fn for fn in os.listdir('mint transactions') if fn.endswith('.csv')]

for filepath in filepaths:
    with open(filepath) as f:
        reader = csv.reader(f)
        
        columns = next(reader)
        if columns != expected_columns:
            raise Error(f'Columns do not equal expected columns in {filepath}!')
        
        for tx in reader:
            old_date = tx[0]
            month, day, year = [int(x) for x in old_date.split('/')]
            new_date = f'{year}-{month:02d}-{day:02d}'

            tx_id = hashlib.sha256((new_date + tx[1] + tx[3] + tx[4]).encode('utf-8')).hexdigest()
            data.append((tx_id, new_date, tx[1], tx[3], tx[4], tx[5], tx[6]))

        cur.executemany('INSERT OR IGNORE INTO transactions VALUES(?, ?, ?, ?, ?, ?, ?)', data)
        con.commit()