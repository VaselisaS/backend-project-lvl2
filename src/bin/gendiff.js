#!/usr/bin/env node

import program from 'commander';
import { version, description } from '../../package.json';

program
  .version(version)
  .description(description)
  .option('-f, --format [type]', 'Output format')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    console.log(firstConfig);
    console.log(secondConfig);
  })
  .parse(process.argv);
