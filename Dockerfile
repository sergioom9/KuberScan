FROM aquasec/trivy:latest

# Install Deno (Node.js not needed if using npm: imports)
RUN apk add --no-cache curl unzip bash

# Install Deno
RUN curl -fsSL https://deno.land/install.sh | sh
ENV DENO_INSTALL="/root/.deno"
ENV PATH="$DENO_INSTALL/bin:$PATH"

WORKDIR /app

# Copy application code
COPY . .

EXPOSE 3000

# Deno will auto-download npm packages on first run
CMD ["deno", "run", \
     "--allow-net", \
     "--allow-run", \
     "--allow-env", \
     "--allow-read", \
     "--allow-write", \
     "server.ts"]