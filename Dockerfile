FROM denoland/deno:alpine-1.46.0
WORKDIR /app
COPY . .

USER root
RUN apk add --no-cache wget git tar gzip \
    && wget https://github.com/aquasecurity/trivy/releases/download/v0.69.1/trivy_0.69.1_Linux-ARM64.tar.gz \
    && tar zxvf trivy_0.69.1_Linux-ARM64.tar.gz \
    && mv trivy /usr/local/bin/ \
    && chmod +x /usr/local/bin/trivy \
    && rm -rf trivy_0.69.1_Linux-ARM64.tar.gz
USER deno

CMD ["run", "--allow-net", "--allow-env", "--allow-sys", "--allow-read","--allow-run", "server.ts"]