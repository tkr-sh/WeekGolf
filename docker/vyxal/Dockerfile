FROM ubuntu:latest

RUN apt update -q -y && \
    apt upgrade -q -y && \
    apt-get -y install python3-pip python3-wheel git && \
    adduser --disabled-password --gecos "" weekgolf && \
    chown weekgolf:weekgolf /mnt

# copy launch script
COPY --chown=weekgolf:weekgolf launch.sh /home/weekgolf/launch.sh

# leave root user
USER weekgolf:weekgolf

RUN mkdir /mnt/in /mnt/out
WORKDIR /home/weekgolf
ENV PATH=/home/weekgolf/.local/bin:$PATH
RUN pip install vyxal
