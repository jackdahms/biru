import sqlite3

from flask import Flask, render_template, request

app = Flask(__name__)
con = sqlite3.connect('transactions.db', check_same_thread=False) # writes must be serialized

child_categories = {
    'Auto & Transport': {'Auto Insurance', 'Auto Payment', 'Gas & Fuel', 'Parking', 'Public Transportation', 'Ride Share', 'Service & Parts'},
    'Bills & Utilities': {'Home Phone', 'Internet', 'Mobile Phone', 'Television', 'Utilities'},
    'Business Services': {'Advertising', 'Legal', 'Office Supplies', 'Printing', 'Shipping'},
    'Education': {'Books & Supplies', 'Student Loan', 'Tuition'},
    'Entertainment': {'Amusement', 'Arts', 'Movies & DVDs', 'Music', 'Newspapers & Magazines'},
    'Fees & Charges': {'ATM Fee', 'Bank Fee', 'Finance Charge', 'Late Fee', 'Service Fee', 'Trade Commissions'},
    'Financial': {'Financial Advisor', 'Life Insurance'},
    'Food & Dining': {'Alcohol & Bars', 'Coffee Shops', 'Fast Food', 'Food Delivery', 'Groceries', 'Restaurants'},
    'Gifts & Donations': {'Charity', 'Gift'},
    'Health & Fitness': {'Dentist', 'Doctor', 'Eyecare', 'Gym', 'Health Insurance', 'Pharmacy', 'Sports'},
    'Hide from Budgets & Trends': {'Important:Home', 'Subcategories', 'Your subcategories'},
    'Income': {'Bonus', 'Interest Income', 'Paycheck', 'Reimbursement', 'Rental Income', 'Returned Purchase'},
    'Investments': {'Buy', 'Deposit', 'Dividend & Cap Gains', 'Sell', 'Withdrawal'},
    'Kids': {'Allowance', 'Baby Supplies', 'Babysitter & Daycare', 'Child Support', 'Kids Activities', 'Toys'},
    'Loans': {'Loan Fees and Charges', 'Loan Insurance', 'Loan Interest', 'Loan Payment', 'Loan Principal'},
    'Misc Expenses': {'Important:Personal Care', 'Subcategories', 'Your subcategories'},
    'Pets': {'Pet Food & Supplies', 'Pet Grooming', 'Veterinary'},
    'Shopping': {'Books', 'Clothing', 'Electronics & Software', 'Hobbies', 'Sporting Goods'},
    'Taxes': {'Federal Tax', 'Local Tax', 'Property Tax', 'Sales Tax', 'State Tax'},
    'Transfer': {'Credit Card Payment', 'Transfer for Cash Spending'},
    'Travel': {'Air Travel', 'Hotel', 'Rental Car & Taxi', 'Vacation'},
    'Uncategorized': {'Cash & ATM', 'Check'}
}

parent_category = {}
for cat in child_categories.keys():
    for subcat in child_categories[cat]:
        parent_category[subcat] = cat

@app.route('/')
def hello_world():
    return render_template('index.html')

@app.route('/transactions')
def transactions():
    start = request.args.get('start')
    end = request.args.get('end')

    cur = con.cursor()
    cur.execute(f'''
        SELECT * FROM transactions
        WHERE date >= '{start}' AND date < '{end}'
    ''')

    txs = []
    categories = {}
    for row in cur:
        txs.append(row)

        cat = row[5]
        if cat in parent_category:
            cat = parent_category[cat]
        if cat not in categories:
            categories[cat] = float(row[3])
        else:
            categories[cat] += float(row[3])

    return {
        'rows': render_template('rows.html', transactions=txs),
        'categories': list(categories.keys()),
        'amounts': list(categories.values())
    }
