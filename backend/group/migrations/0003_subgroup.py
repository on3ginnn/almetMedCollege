# Generated by Django 4.2 on 2025-01-31 18:00

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("group", "0002_alter_group_options"),
    ]

    operations = [
        migrations.CreateModel(
            name="SubGroup",
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
                    models.CharField(max_length=50, verbose_name="название подгруппы"),
                ),
                (
                    "group",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="subgroups",
                        to="group.group",
                        verbose_name="группа",
                    ),
                ),
            ],
            options={
                "unique_together": {("group", "name")},
            },
        ),
    ]
