#!/bin/bash
set -e

npx prisma migrate deploy
node server.js

exec "$@"
