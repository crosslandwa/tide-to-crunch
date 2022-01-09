# tide-to-crunch

Take a CSV exported from Tide and convert it to a CSV suitable for import into Crunch

## Usage

Use `npm` to run the node script passing
- a filepath to your local Tide CSV
- a final balance (i.e. your current balance)

```
npm install
FILE=path/to/tide.csv BALANCE=1234.56 npm start
```

_Note that the supplied `BALANCE` can include commas, eg 10,234.56_

This will print (Crunch friendly) CSV formatted text to the console, e.g.
```
"Date","Transaction description","Amount","Balance"
"19/10/2017","ref: WITHDRAWN 001","-1000","1234.56"
"18/10/2017","ref: ADDED 002","1200.50","2234.56"
"17/10/2017","ref: ADDED 001","1034.06","1034.06"
```

*The script assumes the CSV entries are your most recent, and thus the `final balance` you provide is your current balance (i.e. the balance after the most recent/first transaction in the supplied Tide CSV file)*
