import requests
import time

while True:
    r = requests.get("https://sevencups.onrender.com")
    print(r.status_code)
    time.sleep(60)
