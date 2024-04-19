FROM mcr.microsoft.com/devcontainers/base:jammy@sha256:a3f6ea3b1c7eafa85b6ff8a7c75dcf53b11aa08872eade6352cbd9c6d2016ab3

RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - \
  && sudo apt-get install -y nodejs \
  && corepack enable

# needed to run plantuml
RUN sudo apt install -y graphviz
