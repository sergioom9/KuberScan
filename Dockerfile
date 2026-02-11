FROM aquasec/trivy:latest

RUN apk add --no-cache curl unzip bash nodejs npm

RUN curl -fsSL https://deno.land/install.sh | sh
ENV DENO_INSTALL="/root/.deno"
ENV PATH="$DENO_INSTALL/bin:$PATH"

WORKDIR /app

COPY package*.json ./

RUN npm install express mongoose dotenv

COPY . .

EXPOSE 3000

CMD ["deno", "run", "--allow-net", "--allow-run", "--allow-env", "--allow-read", "--allow-write", "server.ts"]