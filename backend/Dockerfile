FROM python:3.9-slim-buster
RUN apt-get -y update
RUN apt-get -y dist-upgrade
RUN apt-get install -y gcc
RUN apt-get install -y default-libmysqlclient-dev
RUN apt-get -y install pkg-config
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .