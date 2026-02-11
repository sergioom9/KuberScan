FROM aquasec/trivy:latest

RUN apk add --no-cache curl unzip bash ca-certificates

RUN curl -fsSL https://deno.land/install.sh | DENO_INSTALL=/usr/local sh

RUN /usr/local/bin/deno --version

WORKDIR /app

COPY . .

EXPOSE 3000

ENTRYPOINT []

CMD ["/usr/local/bin/deno", "run", "--allow-all", "server.ts"]