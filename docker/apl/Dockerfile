FROM ubuntu:latest

RUN apt update -q -y && \
  apt upgrade -q -y && \
  apt install -y apt-utils wget libncurses5 && \
  adduser --disabled-password --gecos "" weekgolf && \
  chown weekgolf:weekgolf /mnt && \
  wget -O /tmp/apl.deb https://www.dyalog.com/uploads/php/download.dyalog.com/download.php?file=18.2/linux_64_18.2.45405_unicode.x86_64.deb && \
  dpkg -i /tmp/apl.deb && \
  rm /tmp/apl.deb

# copy launch script
COPY --chown=weekgolf:weekgolf launch.sh /home/weekgolf/launch.sh

# leave root user
USER weekgolf:weekgolf

RUN mkdir /mnt/in
RUN mkdir /mnt/out

WORKDIR /home/weekgolf/

