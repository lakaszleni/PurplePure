# Generated by Django 5.0.1 on 2024-02-04 08:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0008_remove_profile_anonymous_token'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='anonym_token',
        ),
    ]
