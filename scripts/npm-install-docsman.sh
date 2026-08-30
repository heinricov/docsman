#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT_DIR/packages/docsman"

NAME="$(node -p "require('./package.json').name")"
VERSION="$(node -p "require('./package.json').version")"
TARBALL="${NAME}-${VERSION}.tgz"

npm run build
npm pack

cd "$ROOT_DIR/__tests__/next"
npm uninstall docsman
npm install ../../packages/docsman/${TARBALL}
npm run typecheck

rm "$ROOT_DIR/packages/docsman/${TARBALL}"
