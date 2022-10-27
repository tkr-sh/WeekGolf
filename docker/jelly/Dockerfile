FROM ubuntu:latest

RUN apt update -q -y
RUN apt upgrade -q -y
RUN apt-get -y install python3-pip python3-wheel git
RUN addgroup weekgolf
RUN adduser --home /home/weekgolf --shell /bin/bash --uid 1000 --gid 1000 weekgolf
RUN chown weekgolf:weekgolf /mnt

# copy launch script
COPY --chown=weekgolf:weekgolf launch.sh /home/weekgolf/launch.sh

# leave root user
USER weekgolf:weekgolf
RUN mkdir /mnt/in
RUN mkdir /mnt/out

WORKDIR /home/weekgolf
RUN git clone -q https://github.com/DennisMitchell/jellylanguage.git
WORKDIR /home/weekgolf/jellylanguage
ENV PATH=/home/weekgolf/.local/bin:$PATH
RUN pip3 install --upgrade --user .
