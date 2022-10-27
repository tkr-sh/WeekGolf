FROM alpine:latest

RUN apk update
RUN apk add bash icu-libs krb5-libs libgcc libintl libssl1.1 libstdc++ zlib wget
RUN apk add libgdiplus --repository https://dl-3.alpinelinux.org/alpine/edge/testing/
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

WORKDIR /home/weekgolf
RUN wget https://dot.net/v1/dotnet-install.sh
RUN bash ./dotnet-install.sh -c Current
RUN mkdir foo
WORKDIR /home/weekgolf/foo
RUN /home/weekgolf/.dotnet/dotnet new console
