# Generated by Django 4.2.4 on 2023-08-23 11:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stream', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='song',
            name='image300',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name='song',
            name='image600',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name='song',
            name='image64',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name='song',
            name='last_modified',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
