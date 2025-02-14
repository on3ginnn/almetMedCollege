import django.db.models


class Major(django.db.models.Model):
    title = django.db.models.CharField(
        "название специальности",
        max_length=255,
        unique=True,
    )

    class Meta:
        verbose_name = "специальность"
        verbose_name_plural = "специальности"

    def __str__(self):
        return self.title