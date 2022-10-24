#/bin/sh

yarn build && node dist/index.js ${@:1}
