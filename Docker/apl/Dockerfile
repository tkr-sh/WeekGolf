FROM debian:buster-slim

RUN apt update && \
    apt install -y curl libtinfo5 && \
    curl -o /tmp/apl.deb "https://www.dyalog.com/uploads/php/download.dyalog.com/download.php?file=18.2/linux_64_18.2.45405_unicode.x86_64.deb" && \
    dpkg -i /tmp/apl.deb && \
    apt-get purge -y curl && \
    rm -rf /tmp/* && \
    apt-get purge -y curl && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*