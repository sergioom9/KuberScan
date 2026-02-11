set -e

echo "================================"
echo "🔍 Trivy Scanner API Starting..."
echo "================================"

if ! command -v deno &> /dev/null; then
    echo "❌ Deno not found!"
    exit 1
fi

if ! command -v trivy &> /dev/null; then
    echo "❌ Trivy not found!"
    exit 1
fi

echo "✅ Deno version: $(deno --version | head -n 1)"
echo "✅ Trivy version: $(trivy --version | head -n 1)"
echo "================================"

echo "🚀 Starting Deno server on port ${PORT:-3000}..."
exec deno run \
  --allow-net \
  --allow-run \
  --allow-env \
  --allow-read \
  --allow-write \
  server.ts