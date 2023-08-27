import datetime
import time

import requests


def keepalive(url="https://sevencups.onrender.com"):
    # print(datetime.datetime.now().strftime("%H:%M:%S"))
    try:
        r = requests.get(url, timeout=100)
    except requests.exceptions.Timeout:
        print("Timeout")
    except requests.exceptions.ConnectionError:
        print("Connection Error")
    else:
        print(r.status_code)

while True:
    print(datetime.datetime.now().strftime("%H:%M:%S"))
    keepalive(url="https://sevencups.onrender.com")
    keepalive(url="http://localhost:8000")

    time.sleep(300)
