# FROM debian:buster-slim

# RUN apt update -q -y && \
#     apt upgrade -q -y && \
#     apt install -y apt-utils && \
#     apt install -y make cmake unzip git && \
#     apt install -y wget tar gzip xzdec gcc sed libgmp3-dev && \
#     mkdir /tmp/in && \
#     cd /tmp/in && \
#     git clone https://codeberg.org/ngn/k.git && \
#     make k-libc 

FROM alpine:latest


RUN apk add git make gcc musl-dev && \
    git clone https://codeberg.org/ngn/k.git && \
    cd k && \
    CC=gcc && \
    make k