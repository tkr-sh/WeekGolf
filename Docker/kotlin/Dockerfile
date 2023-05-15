FROM openjdk:21-bullseye

ENV KOTLIN_VERSION=1.8.20

RUN apt-get update && \
    apt-get install -y wget && \
    wget -q https://github.com/JetBrains/kotlin/releases/download/v$KOTLIN_VERSION/kotlin-compiler-$KOTLIN_VERSION.zip && \
    unzip -qq kotlin-compiler-$KOTLIN_VERSION.zip && \
    rm kotlin-compiler-$KOTLIN_VERSION.zip && \
    apt-get remove -y wget && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ENV PATH="/kotlinc/bin:${PATH}"