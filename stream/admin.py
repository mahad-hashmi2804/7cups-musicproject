from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import SongRequest, Song, User


# Register your models here.
class UsersAdmin(UserAdmin):
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("username", "password1", "password2",
                           "first_name", "last_name", "email",
                           "is_active", "is_staff", "is_superuser",
                           "groups", "user_permissions",),
            },
        ),
    )


class SongRequestAdmin(admin.ModelAdmin):
    list_display = ("song", "played")
    list_filter = ("from_user", "song__status", "played")
    search_fields = ("song__title", "song__artists")


class SongAdmin(admin.ModelAdmin):
    list_display = ("title", "artists", "status", "last_modified", "reviewed_by", "challenged_by", "audio")
    list_filter = ("status", "last_modified")
    search_fields = ("title", "artists", "reviewed_by__username", "challenged_by__username")

admin.site.register(SongRequest, SongRequestAdmin)
admin.site.register(Song, SongAdmin)
admin.site.register(User, UsersAdmin)
