#!/bin/bash -e
cd "$(dirname "$0")"

rm -rf temp
mkdir -p temp
cp ../../main/data/npm.json temp/npm-old.json
node fetch.js
node compare.js
node merge.js
cp -f temp/npm.json ../../main/data/npm.json 