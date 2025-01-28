import django.contrib.auth
import django.db.models

USER_MODEL = django.contrib.auth.get_user_model()


class News(django.db.models.Model):
    publisher = django.db.models.ForeignKey(
        USER_MODEL,
        on_delete=django.db.models.SET_NULL,
        # TODO: доделать
    )

