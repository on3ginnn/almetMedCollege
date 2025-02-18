# Generated by Django 4.2 on 2025-01-29 11:30

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Group",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "name",
                    models.CharField(max_length=5, verbose_name="Название группы"),
                ),
                (
                    "course",
                    models.IntegerField(
                        choices=[
                            (1, "1 курс"),
                            (2, "2 курс"),
                            (3, "3 курс"),
                            (4, "4 курс"),
                        ],
                        verbose_name="Номер курса",
                    ),
                ),
            ],
            options={
                "unique_together": {("name", "course")},
            },
        ),
    ]
