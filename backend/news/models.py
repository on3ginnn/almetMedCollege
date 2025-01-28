import django.contrib.auth
import django.db.models
import django.utils

USER_MODEL = django.contrib.auth.get_user_model()


class News(django.db.models.Model):
    publisher = django.db.models.ForeignKey(
        USER_MODEL,
        on_delete=django.db.models.SET_NULL,
        null=True,
        related_name="news",
        related_query_name="user_news",
        verbose_name="автор",
        help_text="выберите автора статьи",
    )
    title = django.db.models.CharField(
        "заголовок",
        max_length=255,
        help_text="введите заголовок статьи"
    )
    body = django.db.models.TextField(
        "содержание статьи",
        help_text="введите текст статьи"
    )
    created_on = django.db.models.DateTimeField("дата создания", auto_now_add=True)
    updated_on = django.db.models.DateTimeField("дата изменения", auto_now=True)

    def get_publisher_full_name(self):
        return self.publisher.get_full_name().capitalize() if self.publisher else None

    def __str__(self):
        return "%s: %s" % self.publisher.get_full_name(), self.title
    
    class Meta:
        verbose_name = "статья"
        verbose_name_plural = "новости"