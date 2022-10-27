FROM ubuntu:latest

RUN apt update -q -y && \
    apt upgrade -q -y && \
    apt install -y apt-utils &&  \
    apt install -y make cmake unzip git  wget tar gzip && \
    adduser --disabled-password --gecos "" weekgolf && \
    chown weekgolf:weekgolf /mnt

WORKDIR /home/weekgolf

# copy launch script
COPY --chown=weekgolf:weekgolf launch.sh /home/weekgolf/launch.sh

# leave root user
USER weekgolf:weekgolf
RUN mkdir /mnt/in /mnt/out

WORKDIR /home/weekgolf/
RUN wget http://www.jsoftware.com/download/j903/install/j903_linux64.tar.gz && tar xvfz j903_linux64.tar.gz
WORKDIR /home/weekgolf/j903
