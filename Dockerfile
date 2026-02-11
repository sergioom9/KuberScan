FROM aquasec/trivy:latest

# Install Deno
RUN apk add --no-cache curl unzip bash

RUN curl -fsSL https://deno.land/install.sh | sh
ENV DENO_INSTALL="/root/.deno"
ENV PATH="$DENO_INSTALL/bin:$PATH"

WORKDIR /app

# Copy application files
COPY . .

EXPOSE 3000

# Override trivy's entrypoint
ENTRYPOINT []

# Run server directly
CMD ["deno", "run", "--allow-all", "server.ts"]