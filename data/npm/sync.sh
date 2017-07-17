#!/bin/bash

rm -rf temp
mkdir -p temp
cp ../../npm/data/npm.json temp/npm-old.json
node fetch.js
node compare.js
node merge.js
cp -f temp/npm.json ../../npm/data/npm.json 