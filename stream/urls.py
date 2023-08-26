from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login/", views.login_view, name="login"),
    path("logout/", views.logout_view, name="logout"),
    path("song_requests/", views.song_requests, name="song_requests"),
    # path("songs/", views.songs, name="songs"),
    path("player/", views.player, name="player"),
    path("db/", views.db, name="db"),
    path('directory_list/', views.directory, name='directory_list'),

    # API
    path("song_requests_api/", views.song_requests_api, name="song_requests_api"),
    path("song_request/", views.song_request, name="song_request"),
    path("song_review/", views.song_review, name="song_review"),
    path("search/", views.search, name="search"),
    path("audio/", views.song_audio, name="song"),
]
