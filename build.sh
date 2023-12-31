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

python manage.py dbbackup -v 3 --noinput