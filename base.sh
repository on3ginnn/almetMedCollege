#!/bin/bash

# chmod +x base.sh

# Запуск backend

pwd

touch.env
cat .env-example > .env

python3 -m venv venv
source venv/bin/activate

pip3 install -r requirements.txt

ls

cd backend

pwd

python3 manage.py makemigrations schedule
python3 manage.py migrate
python3 manage.py runserver
