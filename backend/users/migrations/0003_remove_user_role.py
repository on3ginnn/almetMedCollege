# Generated by Django 4.2 on 2025-01-26 15:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0002_user_role_group_user_group"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="user",
            name="role",
        ),
    ]
