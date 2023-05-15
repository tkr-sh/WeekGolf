FROM python:3.10.10-alpine3.17

RUN apk add gcc
RUN apk add musl-dev
RUN apk add libc-dev
RUN apk --no-cache add musl-dev linux-headers g++
RUN apk update
# RUN apk add make automake gcc g++ subversion python3-dev
RUN pip install numpy
RUN /usr/local/bin/python -m pip install --upgrade pip
RUN pip install vyxal