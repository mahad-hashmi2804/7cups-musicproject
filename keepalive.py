import datetime
import time

import requests


def keepalive(url="https://sevencups.onrender.com"):
    # print(datetime.datetime.now().strftime("%H:%M:%S"))
    try:
        r = requests.get(url, timeout=100, headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'})

    except requests.exceptions.Timeout:
        print("Timeout")
    except requests.exceptions.ConnectionError:
        print("Connection Error")
    else:
        print(r.status_code)


while True:
    print(datetime.datetime.now().strftime("%H:%M:%S"))
    keepalive(url="https://sevencups.onrender.com")
    # keepalive(url="http://localhost:8000")

    time.sleep(300)
