# Generated by Django 4.2 on 2025-02-14 17:44

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("major", "0002_alter_major_options"),
        ("schedule", "0004_grouplesson_classroom"),
    ]

    operations = [
        migrations.CreateModel(
            name="ClassRoom",
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
                    "label",
                    models.CharField(
                        max_length=255, unique=True, verbose_name="кабинет"
                    ),
                ),
            ],
            options={
                "verbose_name": "кабинет",
                "verbose_name_plural": "кабинеты",
            },
        ),
        migrations.RemoveField(
            model_name="grouplesson",
            name="exercise",
        ),
        migrations.AddField(
            model_name="grouplesson",
            name="major",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="major.major",
                verbose_name="предмет",
            ),
        ),
        migrations.AlterField(
            model_name="grouplesson",
            name="classroom",
            field=models.CharField(
                blank=True,
                choices=[
                    ("cr-102", "102"),
                    ("cr-103", "103"),
                    ("cr-107", "107"),
                    ("cr-201", "201"),
                    ("cr-202", "202"),
                    ("cr-203", "203"),
                    ("cr-204", "204"),
                    ("cr-205", "205"),
                    ("cr-207", "207"),
                    ("cr-204", "204"),
                    ("cr-205", "205"),
                    ("cr-207", "207"),
                ],
                default="---",
                max_length=15,
                verbose_name="кабинет",
            ),
        ),
        migrations.AlterField(
            model_name="grouplesson",
            name="schedule",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="lessons",
                to="schedule.schedule",
                verbose_name="расписание",
            ),
        ),
        migrations.AlterField(
            model_name="grouplesson",
            name="teacher",
            field=models.ForeignKey(
                limit_choices_to={"role__in": ["teacher", "admin"]},
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to=settings.AUTH_USER_MODEL,
                verbose_name="преподаватель",
            ),
        ),
        migrations.DeleteModel(
            name="Exercise",
        ),
    ]
