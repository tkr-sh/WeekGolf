##################################################### -*- sh -*- #####
# build stage
FROM alpine:latest AS builder

RUN apk update
RUN apk add build-base make cmake gcc g++ unzip autoconf  bison re2c libxml2 libxml2-dev sqlite-dev sqlite git
RUN addgroup weekgolf
RUN adduser -h /home/weekgolf -g '' -s /bin/ash -G weekgolf -D weekgolf
RUN chown weekgolf:weekgolf /mnt

WORKDIR /home/weekgolf

# leave root user
USER weekgolf:weekgolf

RUN git clone --single-branch --branch PHP-8.1.10  https://github.com/php/php-src.git
WORKDIR /home/weekgolf/php-src
RUN ./buildconf && ./configure --prefix=/home/weekgolf/php && make && make install

######################################################################
# final stage
FROM alpine:latest

RUN apk update
RUN apk add --update gcc musl-dev libxml2 sqlite sqlite-dev
RUN addgroup weekgolf
RUN adduser -h /home/weekgolf -g '' -s /bin/ash -G weekgolf -D weekgolf
RUN chown weekgolf:weekgolf /mnt

WORKDIR /home/weekgolf
# compile
COPY --chown=weekgolf:weekgolf launch.sh /home/weekgolf/launch.sh
COPY --chown=root:root php.ini /etc/php7/php.ini

# leave root user
USER weekgolf:weekgolf
RUN mkdir /mnt/in && mkdir /mnt/out

COPY --from=builder /home/weekgolf/php /home/weekgolf/php

# remove some binaries
USER root:root
RUN rm -f /usr/bin/perl /usr/bin/tr /bin/ls /bin/ln
USER weekgolf:weekgolf
