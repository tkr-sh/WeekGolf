FROM alpine:latest

RUN apk update
RUN apk add bash g++ make cmake wget gmp gmp-dev ncurses ncurses-dev readline zlib zlib-dev sed
RUN addgroup weekgolf
RUN adduser -h /home/weekgolf -g '' -s /bin/ash -G weekgolf -D weekgolf
RUN chown weekgolf:weekgolf /mnt

WORKDIR /home/weekgolf

RUN chown weekgolf /mnt

# leave root user
USER weekgolf:weekgolf
RUN mkdir /mnt/in
RUN mkdir /mnt/out

# compile from source
RUN wget https://www.swi-prolog.org/download/stable/src/swipl-8.4.3.tar.gz && \
  tar xvfz swipl*.tar.gz && \
  rm swipl*.tar.gz && \
  cd swipl* && \
  mkdir build && \
  cd build && \
  cmake -DCMAKE_INSTALL_PREFIX=/home/weekgolf/prolog .. && \
  mkdir -p man && \
  touch man/ssl && \
  touch man/archive && \
  mkdir -p packages/http && \
  touch packages/http/ssl && \
  make && \
  make install && \
  cd /home/weekgolf && \
  rm -rf swipl*

# copy launch script
COPY --chown=weekgolf:weekgolf launch.sh /home/weekgolf/launch.sh
