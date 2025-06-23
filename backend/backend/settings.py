import os
import pathlib
import datetime

import django.urls
import dotenv


dotenv.load_dotenv()

def env_var_load(value, defoult):
    env_var_value = os.getenv(value, str(defoult)).lower()
    return env_var_value in ("", "true", "yes", "1", "y", "t")

BASE_DIR = pathlib.Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "ABOBA")

DEBUG = env_var_load("DJANGO_DEBUG", False)
print(DEBUG)
print(os.getenv("DJANGO_ALLOWED_HOSTS", ""))
# ALLOWED_HOSTS = list(
#     map(str.strip, os.getenv("DJANGO_ALLOWED_HOSTS", "").split(",")),
# )
ALLOWED_HOSTS = [
    "localhost",
    "demoalmetmed.ru",
    "127.0.0.1",
]

print(f"ALLOWED_HOSTS = {ALLOWED_HOSTS}")

"""
логирование sql запросов в консоль
"""
# LOGGING = {
#     "version": 1,
#     "disable_existing_loggers": False,
#     "handlers": {
#         "console": {
#             "class": "logging.StreamHandler",
#         },
#     },
#     "loggers": {
#         "django.db.backends": {
#             "level": "DEBUG",
#             "handlers": ["console"],
#         },
#     },
# }

AUTH_USER_MODEL = "users.User"

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    'rest_framework',
    'rest_framework_simplejwt',
    "corsheaders",
    "phonenumber_field",

    "users.apps.UsersConfig",
    "news.apps.NewsConfig",
    "group.apps.GroupConfig",
    "schedule.apps.ScheduleConfig",
    "major.apps.MajorConfig",
    "applicant.apps.ApplicantConfig",

]

if DEBUG:
    INSTALLED_APPS.append("debug_toolbar")

PHONENUMBER_DEFAULT_REGION = "RU"

# настройка DRF  аутентификации с помощью JWT-токена
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        # 'rest_framework_simplejwt.authentication.JWTAuthentication',
        'users.authentication.CookieJWTAuthentication',
        # 'rest_framework.authentication.SessionAuthentication',
    ],
}

# конфигурация JWT-токена
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': datetime.timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': datetime.timedelta(days=30),
    'SIGNING_KEY': SECRET_KEY,

    'AUTH_COOKIE': os.getenv('JWT_AUTH_COOKIE', 'access_token'),
    'AUTH_COOKIE_HTTP_ONLY': env_var_load('JWT_AUTH_COOKIE_HTTP_ONLY', True),
    'AUTH_COOKIE_SECURE': env_var_load('JWT_AUTH_COOKIE_SECURE', True),
    'AUTH_COOKIE_SAMESITE': os.getenv('JWT_AUTH_COOKIE_SAMESITE', 'None'),
}

if DEBUG:
    SIMPLE_JWT["AUTH_COOKIE_SECURE"] = False  # Для локальной разработки отключаем Secure

# разрешенные хосты имеющие доступ к бэкэнду
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://demoalmetmed.ru",
]

print(CORS_ALLOWED_ORIGINS)
CORS_ALLOW_METHODS = ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]
CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]
CORS_ALLOW_CREDENTIALS = True

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

if DEBUG:
    INTERNAL_IPS = [
        "127.0.0.1",
    ]
    MIDDLEWARE.insert(0, "debug_toolbar.middleware.DebugToolbarMiddleware")

CMS_COLOR_SCHEME = "light"

ROOT_URLCONF = "backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "backend.wsgi.application"


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# DATABASES = {
#     "default": {
#         "ENGINE": "django.db.backends.postgresql",
#         "NAME": os.getenv("POSTGRES_DB", "almetMed_db"),
#         "USER": os.getenv("POSTGRES_USER", "user"),
#         "PASSWORD": os.getenv("POSTGRES_PASSWORD", "password"),
#         "HOST": os.getenv("POSTGRES_HOST", "localhost"),
#         "PORT": os.getenv("POSTGRES_PORT", "5432"),
#     }
# }

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = "ru-ru"

# Moscow time zone code
TIME_ZONE = "W-SU"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "static"

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
