FROM alpine:latest

RUN apk update
RUN apk add --update perl nodejs npm bash --repository https://dl-3.alpinelinux.org/alpine/edge/main/
RUN addgroup weekgolf
RUN adduser -h /home/weekgolf -g '' -s /bin/ash -G weekgolf -D weekgolf
RUN chown weekgolf:weekgolf /mnt
RUN npm install -g sass

WORKDIR /mnt

# Copy
## Launch script
COPY --chown=weekgolf:weekgolf launch.sh /home/weekgolf/launch.sh
## Built-ins functions
COPY --chown=weekgolf:weekgolf functions.scss /home/weekgolf/functions.scss

# Leave root user
USER weekgolf:weekgolf
WORKDIR /home/weekgolf
RUN npm install readline-sync
RUN mkdir /mnt/in
RUN mkdir /mnt/out

USER root:root
USER weekgolf:weekgolf