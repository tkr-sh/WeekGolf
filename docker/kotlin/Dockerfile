FROM alpine:latest

RUN apk update
RUN apk add openjdk19 --repository https://dl-3.alpinelinux.org/alpine/edge/testing/
RUN apk add bash curl git zip

RUN addgroup weekgolf
RUN adduser -h /home/weekgolf -g '' -s /bin/ash -G weekgolf -D weekgolf
RUN chown weekgolf:weekgolf /mnt

# copy launch script
COPY --chown=weekgolf:weekgolf launch.sh /home/weekgolf/launch.sh
RUN chmod 777 /mnt

# leave root user
USER weekgolf:weekgolf
RUN mkdir /mnt/in
RUN mkdir /mnt/out
RUN chmod 777 /mnt/out

RUN curl -s "https://get.sdkman.io" | bash

RUN bash -c "source $HOME/.sdkman/bin/sdkman-init.sh && sdk version"
RUN bash -c "source $HOME/.sdkman/bin/sdkman-init.sh && sdk install kotlin"
WORKDIR /home/weekgolf/

# run a dummy code once so that all init structures are already in place
RUN printf "fun main() {\n println(generateSequence(::readLine).joinToString(\"\\\\n\"))\n}\n" > prog.kt && \
  /home/weekgolf/.sdkman/candidates/kotlin/current/bin/kotlinc prog.kt -include-runtime -d prog.jar && \
  java -jar prog.jar < prog.kt

