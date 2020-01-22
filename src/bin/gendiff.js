#!/usr/bin/env node
import program from 'commander';
import { version, description } from '../../package.json';
import genDiff from '..';

program
  .version(version)
  .description(description)
  .option('-f, --format [type]', 'Output format', 'json')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    const result = genDiff(firstConfig, secondConfig, program.format);
    console.log(result);
  })
  .parse(process.argv);
