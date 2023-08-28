import django.db.utils
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, AbstractUser
from django.db import connection
from django.db import models


# Create your models here.
class User(AbstractUser, AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(max_length=100, unique=True)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    groups = models.ManyToManyField('auth.Group', blank=True, related_name="users")
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    last_login = models.DateTimeField(blank=True, null=True)
    user_permissions = models.ManyToManyField('auth.Permission', blank=True, related_name="users")

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']


class Song(models.Model):
    song_id = models.CharField(max_length=22, unique=True)
    title = models.CharField(max_length=100)
    artists = models.CharField(max_length=200)
    image600 = models.CharField(max_length=100, blank=True)
    image300 = models.CharField(max_length=100, blank=True)
    image64 = models.CharField(max_length=100, blank=True)
    song_url = models.CharField(max_length=100)
    status = models.CharField(max_length=100, default="pending")
    added_to_playlist = models.BooleanField(default=False)
    last_modified = models.DateTimeField(auto_now=True)
    audio = models.TextField(blank=True)
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, related_name="reviews")
    challenged_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, related_name="challenges")

    def __str__(self):
        return self.title

    def save(self, count=0):
        if count > 5:
            return
        try:
            super().save()
        except django.db.utils.OperationalError:
            connection.connection.close()
            connection.connection = None

            song = Song.objects.get(song_id=self.song_id)
            song.audio = self.audio
            song.reviewed_by = self.reviewed_by
            song.challenged_by = self.challenged_by
            song.last_modified = self.last_modified
            song.status = self.status
            song.save(count=count + 1)

    def challenge(self, user, status="challenged"):
        if self.reviewed_by.groups.filter(name="Song Approver").exists():
            self.status = "challenged"
            if not user.groups.filter(name="Song Approver").exists():
                self.status = status
                self.reviewed_by = user

        elif self.reviewed_by.groups.filter(name="DJ").exists():
            if user.groups.filter(name="Project Leader").exists():
                self.status = status
                self.reviewed_by = user

        self.challenged_by = user
        self.save()


class SongRequest(models.Model):
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    from_user = models.CharField(max_length=100)
    to_user = models.CharField(max_length=100, blank=True)
    played = models.BooleanField(default=False)

    def __str__(self):
        return self.song.title
