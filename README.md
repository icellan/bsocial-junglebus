# bsocial-junglebus
> Bitcoin Social (BitcoinSchema) transaction indexer

bSocial-junglebus is a [Bitbus](https://docs.bitbus.network/) compatible Bitcoin Social indexer. It scans all MAP compatible transactions and processes them into a global bSocial state using JungleBus.

There are other ways to index bSocial transaction, for instance with [bmap-planaria](https://github.com/rohenaz/bmap-planaria). The difference is that bSocial is optimized for the bitcoin social networking features and is less generic than bmap-planaria.

# global installation

```shell
npm install -g bsocial-junglebus
```

Set the environment variables. You must at least set the JungleBus subscription id.

```shell
export BSOCIAL_SUBSCRIPTION_ID=""
```

And optionally overwrite the defaults for the database:

```shell
export BSOCIAL_MONGO_URL="mongodb://localhost:27017/bsocial-junglebus"
```

Indexing bSocial blocks can now be done by running

```shell
bsocial-junglebus
```

The arguments to the bsocial-junglebus cli are:

| arg                    | Description               |
|------------------------|---------------------------|
| `-s <subscription id>` | JungleBus subscription id |

# local installation

```
git clone https://github.com/icellan/bsocial-junglebus.git
```

bsocial-junglebus can run either with settings from a config file (`config.json`) or from environment variables.

config.json
```json
{
  "subscriptionId": "...",
  "mongoUrl": "mongodb://..."
}
```

environment
```shell
export BSOCIAL_SUBSCRIPTION_ID="..."
export BSOCIAL_MONGO_URL="mongo://..."
export BSOCIAL_DEBUG=""
export BSOCIAL_VERBOSE=1
export BSOCIAL_BITFS_STORE=1
export BSOCIAL_BITFS_MAX_LENGTH=10000
```

## run

To run the indexer in watch mode, which also indexes all transactions in the mempool:

```shell
./start.sh
```

## testing

```shell
yarn test
```
or

```shell
yarn testwatch
```

# Including in your own package or site

```
npm install bsocial-junglebus
or
yarn add bsocial-junglebus
```

Make sure you set the environment variables before running any scripts:

```shell
export BSOCIAL_SUBSCRIPTION_ID = '<junglebus subscription id>';
export BSOCIAL_MONGO_URL = 'mongodb://localhost:27017/bsocial-junglebus';
```

Index all mined transactions + listen to the mempool:

```javascript
import { watchBSocialTransactions } from 'bsocial-junglebus/dist';

(async function() {
  await watchBSocialTransactions();
})();
```

There are also hooks available on all the BSocial collections, which you can use to do your own
processing when a transaction comes in.

```javascript
import { watchBSocialTransactions } from 'bsocial-junglebus/dist/watch';
import { BSOCIAL } from 'bsocial-junglebus/dist/schemas/bsocial';
import { LIKES } from 'bsocial-junglebus/dist/schemas/likes';

// BSocial contains the raw posts in bmap format
BSOCIAL.after('insert', async (doc) => {
  // do something with the doc after insert
});

// The LIKES collection contains the like referenced to the tx and idKey
LIKES.before('insert', async(doc) => {
  // do something with the doc before insert
  // the modified doc is what will be inserted
});

(async function() {
  await watchBSocialTransactions();
})();
```

# Babel

Make sure babel is set up properly or that es6 is supported by your own package.
