# Generated by Django 4.2 on 2025-02-14 15:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0009_user_father_name_user_phone_number"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="father_name",
            field=models.CharField(
                blank=True,
                default="",
                max_length=50,
                null=True,
                verbose_name="отчество",
            ),
        ),
    ]
