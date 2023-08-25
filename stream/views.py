import datetime
import json
import os
from threading import Thread

import requests
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, JsonResponse, FileResponse
from django.shortcuts import render
from django.urls import reverse
from django.utils import timezone
from django.views.decorators.csrf import ensure_csrf_cookie

from .models import SongRequest, Song

CLIENT_ID = "f3c2231b9fdf4787a1148762b29cbffe"
CLIENT_SECRET = "1711fb75e5c740f2abe8492fb59f8956"


# SONGS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "songs")

THREADRUNNING = False

def get_song_audio(song_url):
    process = os.popen(
        "spotdl url " + song_url
    )

    return process.read().split("\n")[1]


def update_songs():
    global THREADRUNNING
    THREADRUNNING = True
    def update_song(song):
        song.audio = get_song_audio(song.song_url).replace('\r', '')
        song.last_modified = timezone.now()
        song.save()

    songs = Song.objects.all()

    for song in songs:
        if song.audio == "" or timezone.now() - song.last_modified > datetime.timedelta(minutes=30):
            update_song(song)

    THREADRUNNING = False


Thread(target=update_songs).start()


class Processing:
    def __init__(self):
        self.timestamp = None
        self.token = None
        self.get_token()

    def get_token(self):
        url = "https://accounts.spotify.com/api/token"
        data = {"grant_type": "client_credentials"}
        response = requests.post(url, data=data, auth=(CLIENT_ID, CLIENT_SECRET))
        self.token = response.json()["access_token"]

        self.timestamp = datetime.datetime.now()

    def check_token(self):
        if self.token is None:
            self.get_token()
        else:
            if datetime.datetime.now() - self.timestamp >= datetime.timedelta(hours=1):
                self.get_token()

    def search(self, query):
        self.check_token()

        url = "https://api.spotify.com/v1/search"
        headers = {"Authorization": "Bearer " + self.token}
        params = {"q": query, "type": "track"}
        response = requests.get(url, headers=headers, params=params)
        return response.json()["tracks"]["items"]

    def get_song_data(self, song_id):
        self.check_token()

        url = "https://api.spotify.com/v1/tracks/" + song_id
        headers = {"Authorization": "Bearer " + self.token}
        response = requests.get(url, headers=headers)
        return response.json()


Data = Processing()


def get_song_requests(request):
    if "status" in request.GET:
        song_requests = SongRequest.objects.filter(song__status=request.GET["status"])
        if request.GET["status"] == "rejected":
            song_requests = SongRequest.objects.filter(song__status="challenged") | SongRequest.objects.filter(
                song__status="rejected")
    else:
        song_requests = SongRequest.objects.all()

    if request.GET["played"] == "False":
        song_requests = song_requests.filter(played=False)

    song_requests = song_requests.order_by("-timestamp")
    song_requests = song_requests.select_related("song").values(
        "song__title",
        "song__song_id",
        "song__artists",
        "song__image600",
        "song__image300",
        "song__image64",
        "song__song_url",
        "song__status",
        "song__audio",

        "from_user",
        "to_user",
        "played",
        "timestamp",
        "id"
    )

    return song_requests


# Create your views here.
@ensure_csrf_cookie
def index(request):
    return render(request, 'stream/index.html')


def search(request):
    if request.method == "GET":
        if "q" in request.GET:
            query = request.GET["q"]
            results = Data.search(query)
            return JsonResponse({"results": results})
    return JsonResponse({"message": "Invalid Method!"})


@login_required
def song_requests(request):
    if not THREADRUNNING:
        Thread(target=update_songs).start()

    if request.method == "GET":
        user_group = request.user.groups.all()
        if user_group.count() == 0:
            request.user.groups.add(name="Song Requester")
            request.user.save()
        return render(request, 'stream/requests.html', {"user_type": request.user.groups.all()[0].name})
    return JsonResponse({"message": "Invalid Method!"})


def db(request):
    if request.method == "GET":
        return FileResponse(open("db.sqlite3", "rb"))
    return JsonResponse({"message": "Invalid Method!"})


def login_view(request):
    if request.method == "POST":
        form = request.POST

        if "username" in form and "password" in form:
            username = form["username"]
            password = form["password"]
            print(username, password)

            user = authenticate(request, username=username, password=password)
            print(user)

            if user is not None:
                login(request, user)
                messages.success(request, f"Welcome {username}!")
                return HttpResponseRedirect(reverse("song_requests"))
            else:
                messages.error(request, "Invalid Credentials!", extra_tags="danger")
                return HttpResponseRedirect(reverse("login"))

        messages.error(request, "All fields are required!", extra_tags="danger")

        return HttpResponseRedirect(reverse("login"))
    return render(request, 'stream/login.html')


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("login"))


def song_requests_api(request):
    if request.method == "GET":
        song_requests = get_song_requests(request)

        return JsonResponse({"status": 200, "song_requests": list(song_requests)})

    return JsonResponse({"message": "Invalid Method!"})


def song_request(request):
    if request.method == "POST":
        form = json.loads(request.body)
        print(form)

        request.session["remember"] = form["remember"]

        if "remember" in form:
            if form["from_name"]:
                request.session["name"] = form["from_name"]
                request.session["remember"] = True
                print(form["from_name"])

        if "song_id" in form:
            song_id = form["song_id"]
            # print(song_id)

            if len(song_id) == 22:
                print(song_id)
                if Song.objects.filter(song_id=song_id).exists():
                    song = Song.objects.get(song_id=song_id)

                else:
                    song_data = Data.get_song_data(song_id)
                    song_url = song_data["external_urls"]["spotify"]
                    # audio = get_song_audio(song_url)
                    song_title = song_data["name"]
                    artists = ", ".join([artist["name"] for artist in song_data["artists"]])
                    image600 = song_data["album"]["images"][0]["url"]
                    image300 = song_data["album"]["images"][1]["url"]
                    image64 = song_data["album"]["images"][2]["url"]

                    song = Song(song_id=song_id, title=song_title, artists=artists, song_url=song_url,
                                image600=image600, image300=image300, image64=image64)
                    song.save()

                song_request = SongRequest(song=song, from_user=form["from_name"], to_user=form["to_name"])
                song_request.save()

                return JsonResponse({"success": True})

        return JsonResponse({"success": False})

    return JsonResponse({"message": "Invalid Method!"})


@login_required
def song_review(request):
    if request.method == "POST":
        # print(request.body)
        form = json.loads(request.body)

        if "status" in form:
            if form["status"] == "played":
                if not request.user.groups.filter(name="Song Approver").exists():
                    song_request = SongRequest.objects.get(id=form["song_id"])
                    song_request.played = True
                    song_request.save()
                    return JsonResponse({"status": 201, "action": "marked as played"})
                return JsonResponse({"status": 403, "message": "You are not allowed to perform this action!"})

        if "song_id" in form:
            song = Song.objects.get(song_id=form["song_id"])

            if "status" in form:
                status = {
                    "approve": "approved",
                    "reject": "rejected",
                }
                if song.status == "pending":
                    song.status = status[form["status"]]
                    song.reviewed_by = request.user
                    song.save()
                elif song.status != status[form["status"]]:
                    print(request.user.groups.all())
                    if request.user.groups.filter(name="Song Approver").exists():
                        song.challenge(request.user)
                    else:
                        song.challenge(request.user, status=status[form["status"]])

                return JsonResponse({"status": 201, "action": song.status})
        return JsonResponse({"status": 404, "success": False})
    return JsonResponse({"status": 405, "message": "Invalid Method!"})


def song_audio(request):
    if request.method == "GET":
        if "song_id" in request.GET:
            song_id = request.GET["song_id"]
            if Song.objects.filter(song_id=song_id).exists():
                song = Song.objects.get(song_id=song_id)
                if song.audio == "" or timezone.now() - song.last_modified > datetime.timedelta(minutes=30) or \
                        request.GET["force"] == "true":
                    song.audio = get_song_audio(song.song_url).replace('\r', '')
                    song.last_modified = timezone.now()
                    song.save()

                return JsonResponse({"audio": song.audio})
        return JsonResponse({"message": "Something went wrong!"})
    return JsonResponse({"message": "Invalid Method!"})


def player(request):
    if request.method == "GET":
        return render(request, 'stream/player.html')
    return JsonResponse({"message": "Invalid Method!"})
