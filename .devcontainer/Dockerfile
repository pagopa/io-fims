FROM mcr.microsoft.com/devcontainers/base:jammy

RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - \
  && sudo apt-get install -y nodejs \
  && corepack enable

# needed to run plantuml
RUN sudo apt install -y graphviz