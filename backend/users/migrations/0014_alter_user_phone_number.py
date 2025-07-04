# Generated by Django 4.2 on 2025-06-07 14:19

from django.db import migrations
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0013_studentinfo_enrollment_date_studentinfo_group_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="phone_number",
            field=phonenumber_field.modelfields.PhoneNumberField(
                blank=True,
                max_length=128,
                null=True,
                region=None,
                verbose_name="номер телефона",
            ),
        ),
    ]
