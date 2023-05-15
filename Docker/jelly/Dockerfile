FROM alpine:latest

RUN cd / && \
    apk add git python3 py-pip && \
    git clone -q https://github.com/DennisMitchell/jellylanguage.git && \
    cd jellylanguage && \
    pip3 install --upgrade --user .