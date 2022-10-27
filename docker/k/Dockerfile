FROM ubuntu:latest

RUN apt update -q -y
RUN apt upgrade -q -y
RUN apt install -y apt-utils
RUN apt install -y make cmake unzip git
RUN apt install -y wget tar gzip xzdec gcc sed libgmp3-dev
RUN apt install -y python3
RUN addgroup weekgolf
RUN adduser --home /home/weekgolf --shell /bin/bash --uid 1000 --gid 1000 weekgolf
RUN chown weekgolf:weekgolf /mnt

WORKDIR /home/weekgolf

# copy launch script
COPY --chown=weekgolf:weekgolf launch.sh /home/weekgolf/launch.sh

# leave root user
USER weekgolf:weekgolf
RUN mkdir /mnt/in
RUN mkdir /mnt/out

RUN git clone https://codeberg.org/ngn/k.git
WORKDIR /home/weekgolf/k
RUN make k-libc
