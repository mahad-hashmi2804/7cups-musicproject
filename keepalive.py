import datetime
import time

import requests


def keepalive(url="https://sevencups.onrender.com"):
    # print(datetime.datetime.now().strftime("%H:%M:%S"))
    try:
        r = requests.get(url, timeout=100, headers={"""Alt-Svc:
h3=":443"; ma=86400

Cf-Cache-Status:
DYNAMIC
Cf-Ray:
7fd6c6015d7b516a-HKG
Content-Length:
0
Date:
Sun, 27 Aug 2023 19:38:31 GMT
Server:
cloudflare
Vary:
Accept-Encoding
X-Render-Origin-Server:
Render
X-Render-Routing:
dynamic-user-server-502
:authority:
sevencups.onrender.com
:method:
GET
:path:
/
:scheme:
https
Accept:
text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8
Accept-Encoding:
gzip, deflate, br
Accept-Language:
en-PK,en;q=0.5
Cache-Control:
max-age=0
Cookie:
AMP_MKTG_8f1ede8e9c=JTdCJTdE; sessionid=z0jwmkqu6gjl3dxa3zj1lxbxh48ti75x; AMP_8f1ede8e9c=JTdCJTIyZGV2aWNlSWQlMjIlM0ElMjI5MDRkY2IxMi0zYThlLTQ5MjMtOTcwZi1hY2YyNDgwNGJkOGElMjIlMkMlMjJzZXNzaW9uSWQlMjIlM0ExNjkyOTU2MDM0MjI4JTJDJTIyb3B0T3V0JTIyJTNBZmFsc2UlMkMlMjJsYXN0RXZlbnRUaW1lJTIyJTNBMTY5Mjk1NjAzNDI4NyUyQyUyMmxhc3RFdmVudElkJTIyJTNBMCU3RA==
Sec-Ch-Ua:
"Chromium";v="116", "Not)A;Brand";v="24", "Brave";v="116"
Sec-Ch-Ua-Mobile:
?0
Sec-Ch-Ua-Platform:
"Windows"
Sec-Fetch-Dest:
document
Sec-Fetch-Mode:
navigate
Sec-Fetch-Site:
none
Sec-Fetch-User:
?1
Sec-Gpc:
1
Upgrade-Insecure-Requests:
1
User-Agent:
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36"""})

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
