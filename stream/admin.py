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



admin.site.register(SongRequest)
admin.site.register(Song)
admin.site.register(User, UsersAdmin)
