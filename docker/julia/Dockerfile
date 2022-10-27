FROM alpine:latest

RUN apk update
RUN apk add --update wget tar gzip
RUN addgroup weekgolf
RUN adduser -h /home/weekgolf -g '' -s /bin/ash -G weekgolf -D weekgolf
RUN chown weekgolf:weekgolf /mnt

WORKDIR /home/weekgolf

# copy launch script
COPY --chown=weekgolf:weekgolf launch.sh /home/weekgolf/launch.sh

# leave root user
USER weekgolf:weekgolf
RUN mkdir /mnt/in
RUN mkdir /mnt/out

RUN wget https://julialang-s3.julialang.org/bin/musl/x64/1.8/julia-1.8.2-musl-x86_64.tar.gz && \
    tar xvfz julia-*-musl-x86_64.tar.gz && \
    rm julia-*-musl-x86_64.tar.gz && \
    ln -s julia-* julia
