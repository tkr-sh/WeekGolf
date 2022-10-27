FROM alpine:latest

RUN apk update
RUN apk add --update --no-cache ocaml ocaml-compiler-libs
RUN addgroup weekgolf
RUN adduser -h /home/weekgolf -g '' -s /bin/ash -G weekgolf -D weekgolf
RUN chown weekgolf:weekgolf /mnt

WORKDIR /mnt

# copy launch script
COPY --chown=weekgolf:weekgolf launch.sh /home/weekgolf/launch.sh

# leave root user
USER weekgolf:weekgolf
RUN mkdir /mnt/in
RUN mkdir /mnt/out

USER root:root
RUN rm -f /usr/bin/tr /bin/ls
USER weekgolf:weekgolf
