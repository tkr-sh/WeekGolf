##################################################### -*- sh -*- #####
# build stage
FROM alpine:latest AS builder

RUN apk update
RUN apk add build-base make cmake gcc g++ unzip autoconf bison re2c git bash libffi-dev 
RUN addgroup weekgolf
RUN adduser -h /home/weekgolf -g '' -s /bin/ash -G weekgolf -D weekgolf
RUN chown weekgolf:weekgolf /mnt

WORKDIR /home/weekgolf

# leave root user
USER weekgolf:weekgolf

RUN git clone https://github.com/dzaima/CBQN && \
    mkdir bin && \
    cd CBQN && \
    git rev-parse --short HEAD > ../CBQN_git_hash.txt && \
    make CC=gcc && \
    make install CC=gcc PREFIX=/home/weekgolf

######################################################################
# final stage
FROM alpine:latest

RUN apk update
RUN apk add libffi-dev
RUN addgroup weekgolf
RUN adduser -h /home/weekgolf -g '' -s /bin/ash -G weekgolf -D weekgolf
RUN chown weekgolf:weekgolf /mnt

WORKDIR /home/weekgolf
# compile
COPY --chown=weekgolf:weekgolf launch.sh /home/weekgolf/launch.sh

# leave root user
USER weekgolf:weekgolf
RUN mkdir /mnt/in && mkdir /mnt/out

RUN mkdir /home/weekgolf/bin
COPY --from=builder /home/weekgolf/bin/bqn /home/weekgolf/bin/bqn
COPY --from=builder /home/weekgolf/CBQN_git_hash.txt /home/weekgolf/CBQN_git_hash.txt 

# remove some binaries
USER root:root
RUN rm -f /usr/bin/perl /usr/bin/tr /bin/ls /bin/ln
USER weekgolf:weekgolf
