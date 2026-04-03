#!/bin/sh

echo "→ Running prisma db push..."
npx prisma db push && echo "✓ DB push complete" || echo "⚠ DB push failed — check DATABASE_URL. Continuing startup..."

echo "→ Starting Next.js on port ${PORT:-3000}..."
exec npx next start -p "${PORT:-3000}"
