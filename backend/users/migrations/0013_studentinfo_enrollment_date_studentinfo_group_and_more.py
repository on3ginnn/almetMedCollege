# Generated by Django 4.2 on 2025-02-14 17:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("group", "0005_delete_subgroup"),
        ("major", "0002_alter_major_options"),
        ("users", "0012_teacherinfo_studentinfo"),
    ]

    operations = [
        migrations.AddField(
            model_name="studentinfo",
            name="enrollment_date",
            field=models.DateField(
                auto_now_add=True, null=True, verbose_name="дата зачисления"
            ),
        ),
        migrations.AddField(
            model_name="studentinfo",
            name="group",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="group_students",
                to="group.group",
                verbose_name="группа",
            ),
        ),
        migrations.AlterField(
            model_name="studentinfo",
            name="major",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="major_students",
                to="major.major",
                verbose_name="специальность",
            ),
        ),
    ]
