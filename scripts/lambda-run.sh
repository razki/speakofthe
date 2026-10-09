#!/bin/bash
set -euo pipefail
mkdir -p /tmp/next-cache
export HOSTNAME=0.0.0.0
exec node server.js
