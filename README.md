# HS-TT – Timetable of HS Ulm
![example timetable](docs/example-timetable.png)

## How it works
* Load every module you have signed up to
* Load information to every lecture of those modules
* Apply defined rules like holidays are lecture free
* Build HTML site on every HTTP request

## Installation
* Requirements: Node 8
* `npm install`
* Create file creds.js in project folder that contains:
```
module.exports = {
   asdf: "your university username",
   fdsa: "your password"
 };
```
* `npm start`
* HS-TT will start to make dozens of requests, can take up to a few minutes
* Go to [localhost:3000](http://localhost:3000)
