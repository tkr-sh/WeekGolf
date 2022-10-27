##################################################### -*- sh -*- #####
# build stage
FROM ubuntu:latest AS builder

RUN apt update -q -y && \
    apt upgrade -q -y  && \
    apt install build-essential wget gnupg apt-utils git gcc g++ libncurses5-dev libncursesw5-dev make locales libssl-dev -y && \
    adduser --disabled-password --gecos "" weekgolf && \
    chown weekgolf:weekgolf /mnt && \
    locale-gen en_US.UTF-8 && \
    update-locale LANG=en_US.UTF-8 && \
    mkdir -p /etc/default && \
    echo 'LANG=en_US.UTF-8' > /etc/default/locale


# leave root user
USER weekgolf:weekgolf

ENV PATH=/home/weekgolf/erlang/bin:/home/weekgolf/bin:$PATH
ENV LANG=en_US.UTF-8 

WORKDIR /home/weekgolf
RUN echo "### compiling erlang" && \
    git clone https://github.com/erlang/otp.git && \
    cd otp && \
    git checkout maint-25 && \
    ./configure --prefix=/home/weekgolf/erlang && \
    make && \
    make install && \
    cd /home/weekgolf
RUN echo "### compiling elixir" && \
    git clone https://github.com/elixir-lang/elixir.git && \
    cd elixir && \
    PREFIX=/home/weekgolf make clean install && \
    echo 'IO.write(IO.read(:stdio, :line))' > prog.exs && \
    echo "123" | elixir prog.exs

######################################################################
# final stage
FROM ubuntu:latest

RUN apt update -q -y && \
    apt upgrade -q -y  && \
    apt install gnupg apt-utils libncurses5-dev libncursesw5-dev locales -y && \
    adduser --disabled-password --gecos "" weekgolf && \
    chown weekgolf:weekgolf /mnt && \
    locale-gen en_US.UTF-8 && \
    update-locale LANG=en_US.UTF-8

# copy from builder stage
COPY --from=builder /home/weekgolf/bin    /home/weekgolf/bin
COPY --from=builder /home/weekgolf/lib    /home/weekgolf/lib
COPY --from=builder /home/weekgolf/share  /home/weekgolf/share
COPY --from=builder /home/weekgolf/erlang /home/weekgolf/erlang

# launch script
COPY --chown=weekgolf:weekgolf launch.sh /home/weekgolf/launch.sh

# leave root user
USER weekgolf:weekgolf
RUN mkdir /mnt/in /mnt/out
                                                                                                                                    
WORKDIR /home/weekgolf
ENV PATH=/home/weekgolf/erlang/bin:/home/weekgolf/bin:$PATH
ENV LANG=en_US.UTF-8 

