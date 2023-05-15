# FROM debian:buster-slim


# RUN apt update -y && apt upgrade -y && apt install -y curl && \
#     curl -s --compressed "https://virtuslab.github.io/scala-cli-packages/KEY.gpg" | apt-key add - && \
#     curl -s --compressed -o /etc/apt/sources.list.d/scala_cli_packages.list "https://virtuslab.github.io/scala-cli-packages/debian/scala_cli_packages.list" && \
#     apt update && \
#     apt install scala-cli

FROM openjdk:21-bullseye


# Install dependencies
RUN apk --no-cache add openjdk11 scala