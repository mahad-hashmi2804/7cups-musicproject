#!/usr/bin/env bash
# exit on error
set -o errexit
#
#poetry lock
#poetry install

pip install --upgrade pip
pip install -r requirements.txt
python manage.py makemigrations
python manage.py collectstatic --noinput
python manage.py migrate
python manage.py createsuperuser --noinput --username admin --email admin@site.com