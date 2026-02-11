FROM aquasec/trivy:latest

# Install Deno
RUN apk add --no-cache curl unzip bash

RUN curl -fsSL https://deno.land/install.sh | sh
ENV DENO_INSTALL="/root/.deno"
ENV PATH="$DENO_INSTALL/bin:$PATH"

WORKDIR /app

COPY start.sh .
RUN chmod +x start.sh

COPY . .

EXPOSE 3000

CMD ["./start.sh"]