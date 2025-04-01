# Generated by Django 4.2 on 2025-04-01 09:34

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('schedule', '0013_alter_schedule_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='grouplesson',
            name='schedule',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lessons', to='schedule.schedule', verbose_name='расписание'),
        ),
    ]
