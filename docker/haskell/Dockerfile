##################################################### -*- sh -*- #####
# build stage
FROM alpine:latest AS builder

RUN apk update
RUN apk add --update build-base make cmake unzip
RUN apk add --update wget tar gzip xz gcc sed gmp-dev
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN addgroup weekgolf
RUN adduser -h /home/weekgolf -g '' -s /bin/ash -G weekgolf -D weekgolf

# leave root user
USER weekgolf:weekgolf
WORKDIR /home/weekgolf

RUN wget https://downloads.haskell.org/~ghc/9.4.3/ghc-9.4.3-x86_64-alpine3_12-linux-static-int_native.tar.xz && \
    tar -xf ghc-9.4.3-x86_64-alpine3_12-linux-static-int_native.tar.xz && \
    rm -rf ghc-9.4.3-x86_64-alpine3_12-linux-static-int_native.tar.xz && \
    cd /home/weekgolf/ghc-9.4.3-x86_64-unknown-linux && \
    ./configure --prefix=/home/weekgolf/ghc && \
    make install && \
    cd .. && \
    rm -rf /home/weekgolf/ghc-9.4.3-x86_64-unknown-linux

######################################################################
# final stage
FROM alpine:latest

RUN apk update
RUN apk add --update gmp-dev gcc musl-dev
RUN addgroup weekgolf
RUN adduser -h /home/weekgolf -g '' -s /bin/ash -G weekgolf -D weekgolf
RUN chown weekgolf:weekgolf /mnt

# script to launch the program
COPY --chown=weekgolf:weekgolf launch.sh /home/weekgolf/launch.sh

# delete useless files
USER root:root
RUN rm /usr/bin/tr
RUN rm /bin/ls

# leave root user
USER weekgolf:weekgolf

# create mount point to read/write data
RUN mkdir /mnt/in /mnt/out

# set default workdir
WORKDIR /home/weekgolf

# copy ghc
COPY --from=builder /home/weekgolf/ghc /home/weekgolf/ghc
