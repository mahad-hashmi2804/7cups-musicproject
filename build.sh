#!/usr/bin/env bash
# exit on error
set -o errexit

poetry lock
poetry install

pip install --upgrade pip
pip install -r requirements.txt
python manage.py makemigrations
python manage.py collectstatic --no-input
python manage.py migrate