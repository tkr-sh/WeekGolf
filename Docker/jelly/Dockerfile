FROM debian:latest

RUN cd /tmp && \
    apt update -y && \
    apt-get -y install python3-pip python3 python3-full git && \
    git clone -q https://github.com/DennisMitchell/jellylanguage.git && \
    cd jellylanguage && \
    pip3 install --upgrade --user . --break-system-packages && pwd
