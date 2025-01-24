from django.db import models
import django.contrib.auth.models


class User(django.contrib.auth.models.AbstractUser):
    pass
