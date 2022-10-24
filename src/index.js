#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/yargs';
import { indexBSocialTransactions } from './bsocial';
import { SUBSCRIPTION_ID } from './config';

const options = yargs(hideBin(process.argv))
  .usage('Usage: -a <action>')
  .option('s', {
    alias: 'subscription',
    describe: 'JungleBus subscription id',
    type: 'string',
  })
  .argv;

(async () => {
  console.log('Running continuous watch');
  await indexBSocialTransactions(options.subscription || SUBSCRIPTION_ID);
})()
  .catch((error) => {
    console.error(error);
  });
