FROM archlinux:latest AS base

RUN pacman -Sy archlinux-keyring --noconfirm; pacman -Syu base-devel --noconfirm
RUN useradd -m --shell=/bin/false build && usermod -L build
RUN install -d -m 0755 -o build -g users /home/build/.cache/
RUN mkdir -m 777 /app
WORKDIR /app

FROM base AS yay

RUN pacman -Syu wget go git --noconfirm
RUN wget "https://aur.archlinux.org/cgit/aur.git/plain/PKGBUILD?h=yay-git" -O PKGBUILD
USER build
RUN makepkg

FROM base AS build

COPY --from=yay /app/yay*.pkg.* /app/
RUN pacman -U /app/yay*.pkg.* --noconfirm
RUN echo "build ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers
USER build

RUN yay -Sy --noconfirm scala
