#!/bin/node

/** A script to set the context of .env.json dynamically */

// https://itnext.io/the-easiest-way-to-setup-multiple-environments-on-react-native-67b33d073390

const fs = require('fs');
const environment = process.argv[2];
const envFileContent = require(`../env/${environment}.json`);
fs.writeFileSync('src/env.json', JSON.stringify(envFileContent, undefined, 2));
