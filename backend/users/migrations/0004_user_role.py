# Generated by Django 4.2 on 2025-01-27 07:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_remove_user_role'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='role',
            field=models.CharField(choices=[('student', 'Студент'), ('teacher', 'Преподаватель'), ('admin', 'Администратор')], default='student', max_length=10),
        ),
    ]
