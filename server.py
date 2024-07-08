from flask import Flask, request, jsonify
import requests
import pytz
from datetime import datetime
from dateutil.relativedelta import relativedelta

finnhub_key = 'cnbtnfpr01qlfrvka8j0cnbtnfpr01qlfrvka8jg'
polygon_key = 'FckwwVDqTlTayduwzls_PSRz3ptKwxFB'

app = Flask(__name__)

monthDict = {
    1:  'January',
    2:  'Febuary',
    3:  'March',
    4:  'April',
    5:  'May',
    6:  'June',
    7:  'July',
    8:  'August',
    9:  'September',
    10: 'October',
    11: 'November',
    12: 'December'
}

def formatTime(timestamp):
    date = datetime.fromtimestamp(timestamp)
    return str(date.day) + " " + monthDict[date.month] + " " + str(date.year)
    
def validateNews(feed):
    if feed["datetime"] == None or feed["datetime"] == 0:
        return False
    if feed["headline"] == None or len(feed["headline"]) == 0:
        return False
    if feed["image"] == None or len(feed["image"]) == 0:
        return False
    if feed["url"] == None or len(feed["url"]) == 0:
        return False
    return True

@app.route("/", methods=['GET'])
@app.route("/index", methods=['GET'])
def indexPage():
    return app.send_static_file("index.html")

@app.route("/profile/<name>", methods=['GET'])
def getProfile(name):
    payload = {'symbol': name.upper(), 'token': finnhub_key}
    rawdata = requests.get("https://finnhub.io/api/v1/stock/profile2", params=payload)
    data = rawdata.json()
    if 'ticker' in data.keys():
        data['found'] = 'Y'
    else:
        data['found'] = 'N'
    
    return jsonify(data)

@app.route("/summary/<name>", methods=['GET'])
def getSummary(name):
    payload = {'symbol': name.upper(), 'token': finnhub_key}
    rawQuote = requests.get("https://finnhub.io/api/v1/quote", params=payload)
    rawRecom = requests.get("https://finnhub.io/api/v1/stock/recommendation", params=payload)
    quote = rawQuote.json()
    recom = rawRecom.json()
    quote["t"] = formatTime(quote["t"])
    msgRecom = {}
    if len(recom) > 0:
        msgRecom = recom[0]
    result = {'symbol': name.upper(), 'quote': quote, 'recommendation': msgRecom}
    return jsonify(result)

@app.route("/charts/<name>", methods=['GET'])
def getCharts(name):
    enddate = datetime.now(pytz.timezone('America/Los_Angeles'))
    startdate = enddate + relativedelta(months=-6, days=-1)
    data = requests.get(f"https://api.polygon.io/v2/aggs/ticker/{name.upper()}/range/1/day/{startdate.strftime('%Y-%m-%d')}/{enddate.strftime('%Y-%m-%d')}?adjusted=true&sort=asc&apiKey={polygon_key}")
    if data.ok:
        return jsonify(data.json())
    else:
        return "Data Not Found", 404


@app.route("/news/<name>", methods=['GET'])
def getNews(name):
    enddate = datetime.now(pytz.timezone('America/Los_Angeles'))
    startdate = enddate + relativedelta(days=-30)
    payload = {'symbol': name.upper(), 'token': finnhub_key, 
        'from': startdate.strftime('%Y-%m-%d'), 'to': enddate.strftime('%Y-%m-%d')}
    rawdata = requests.get("https://finnhub.io/api/v1/company-news", params=payload)
    data = rawdata.json()
    selected = []
    i = 0
    while i < len(data) and len(selected) < 5:
        if validateNews(data[i]):
            data[i]["datetime"] = formatTime(data[i]["datetime"])
            selected.append(data[i])
        i += 1
    return jsonify(selected)

if __name__ == "__main__":
    app.debug = True
    app.run()