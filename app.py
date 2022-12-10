import sqlite3

from flask import Flask, render_template


app = Flask(__name__)
con = sqlite3.connect('transactions.db', check_same_thread=False) # writes must be serialized

@app.route('/')
def hello_world():
    cur = con.cursor()
    cur.execute('''
        SELECT * FROM transactions
        WHERE date >= '2022-10-01' AND date < '2022-11-01'
    ''')
    txs = [row for row in cur]

    return render_template('index.html', transactions=txs)