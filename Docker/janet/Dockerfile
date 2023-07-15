from alpine:latest

RUN apk update \
    && apk add git make gcc build-base

RUN git clone https://github.com/janet-lang/janet && \
    cd janet && \
    ls && \
    make && \
    make install
