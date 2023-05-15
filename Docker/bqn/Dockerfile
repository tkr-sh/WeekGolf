FROM alpine:latest AS builder

RUN apk update \
    && apk add build-base make cmake gcc g++ unzip autoconf bison re2c git bash libffi-dev 

RUN git clone https://github.com/dzaima/CBQN && \
    cd CBQN && \
    git rev-parse --short HEAD > ../CBQN_git_hash.txt && \
    make CC=gcc && \
    make install CC=gcc
