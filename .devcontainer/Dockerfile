ARG VARIANT=bullseye
ARG PLATFORM=linux/amd64
FROM --platform=${PLATFORM} mcr.microsoft.com/vscode/devcontainers/base:0-${VARIANT}

RUN export DENO_INSTALL=/deno \
 && export DENO_DIR=${DENO_INSTALL}/.cache/deno \
 && export PATH=${DENO_INSTALL}/bin:${PATH} \
 && mkdir -p ${DENO_INSTALL} \
 && curl -fsSL https://deno.land/x/install/install.sh | sh \
 && chown -R vscode ${DENO_INSTALL} ;

# [Optional] Uncomment this section to install additional OS packages.
RUN apt-get update \
 && export DEBIAN_FRONTEND=noninteractive \
 && apt-get -y install \
    --no-install-recommends \
    build-essential \
    ca-certificates \
    gcc ;


