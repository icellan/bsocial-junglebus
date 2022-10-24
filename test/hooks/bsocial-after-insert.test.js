import { describe, expect, beforeEach, afterEach, test, } from '@jest/globals';
import bsv from 'bsv';
import { enableFetchMocks } from 'jest-fetch-mock'
enableFetchMocks();

import { bSocialAfterInsert } from '../../src/schemas/hooks/bsocial-after-insert';
import { LIKES } from '../../src/schemas/likes';
import { REPOSTS } from '../../src/schemas/reposts';
import { COMMENTS } from '../../src/schemas/comments';
import { TIPS } from '../../src/schemas/tips';
import { FOLLOWS } from '../../src/schemas/follows';
import { PAYMENTS } from '../../src/schemas/payments';
import { FRIENDS } from '../../dist/schemas/friends';

const txId = 'bc2298e0db1edb01d37cab535e2d639c830a0cb703bbb78b903466b39fe1f0dd';
const idKey = 'c38bc59316de9783b5f7a8ba19bc5d442f6c9b0988c48a241d1c58a1f4e9ae19';
const idKey2 = 'd38bc59316de9783b5f7a8ba19bc5d442f6c9b0988c48a241d1c58a1f4e9ae20';
const tx = '868e663652556fa133878539b6c65093e36bef1a6497e511bdf0655b2ce1c935';
const tx2 = '968e663652556fa133878539b6c65093e36bef1a6497e511bdf0655b2ce1c936';
const _id = bsv.crypto.Hash.sha256(Buffer.from(`${idKey}${tx}`)).toString('hex');

const doc = {
  _id: txId,
  AIP: [
    {
      bapId: idKey,
      verified: true,
    }
  ],
  MAP: [
    {
      type: 'like',
      context: 'tx',
      tx: tx
    }
  ]
};

const followDoc = {
  _id: txId,
  AIP: [
    {
      bapId: idKey,
      verified: true,
    }
  ],
  MAP: [
    {
      type: 'follow',
      idKey: 'follow_id_key'
    }
  ]
};
const unFollowDoc = {
  _id: tx2,
  AIP: [
    {
      bapId: idKey,
      verified: true,
    }
  ],
  MAP: [
    {
      type: 'unfollow',
      idKey: 'follow_id_key'
    }
  ]
};
const follow_id = bsv.crypto.Hash.sha256(Buffer.from(`${idKey}follow_id_key`)).toString('hex');

const friendDoc = {
  _id: txId,
  AIP: [
    {
      bapId: idKey,
      verified: true,
    }
  ],
  MAP: [
    {
      type: 'friend',
      bapID: idKey2,
      publicKey: 'public key of friend 1'
    }
  ]
};
const friend2Doc = {
  _id: tx2,
  AIP: [
    {
      bapId: idKey2,
      verified: true,
    }
  ],
  MAP: [
    {
      type: 'friend',
      bapID: idKey,
      publicKey: 'public key of friend 2'
    }
  ]
};

describe('bSocialAfterInsert like', () => {
  beforeEach(async () => {
    await LIKES.deleteMany({});
  });

  test('like', async () => {
    await bSocialAfterInsert(doc);
    const like = await LIKES.findOne();
    expect(typeof like).toBe('object');
    expect(like._id).toBe(_id);
    expect(like.txId).toBe(txId);
    expect(like.idKey).toBe(idKey);
    expect(like.tx).toBe(tx);
  });
});

describe('bSocialAfterInsert repost', () => {
  beforeEach(async () => {
    await REPOSTS.deleteMany({});
  });

  test('repost', async () => {
    const useDoc = {...doc};
    useDoc.MAP[0].type = 'repost';
    await bSocialAfterInsert(useDoc);
    const repost = await REPOSTS.findOne();
    expect(typeof repost).toBe('object');
    expect(repost._id).toBe(_id);
    expect(repost.txId).toBe(txId);
    expect(repost.idKey).toBe(idKey);
    expect(repost.tx).toBe(tx);
  });
});

describe('bSocialAfterInsert comment', () => {
  beforeEach(async () => {
    await COMMENTS.deleteMany({});
  });

  test('comment', async () => {
    const useDoc = {...doc};
    useDoc.MAP[0].type = 'post';
    await bSocialAfterInsert(useDoc);
    const comment = await COMMENTS.findOne();
    expect(typeof comment).toBe('object');
    expect(comment._id).toBe(_id);
    expect(comment.txId).toBe(txId);
    expect(comment.idKey).toBe(idKey);
    expect(comment.tx).toBe(tx);
  });
});

describe('bSocialAfterInsert tip', () => {
  beforeEach(async () => {
    await TIPS.deleteMany({});
  });

  test('tip', async () => {
    const useDoc = {...doc};
    useDoc.MAP[0].type = 'tip';
    useDoc.MAP[0].currency = 'USD';
    useDoc.MAP[0].amount = '0.1';
    await bSocialAfterInsert(useDoc);
    const tip = await TIPS.findOne();
    expect(typeof tip).toBe('object');
    expect(tip._id).toBe(_id);
    expect(tip.txId).toBe(txId);
    expect(tip.idKey).toBe(idKey);
    expect(tip.tx).toBe(tx);
    expect(tip.c).toBe('USD');
    expect(tip.a).toBe(0.1);
  });
});

describe('bSocialAfterInsert follow', () => {
  beforeEach(async () => {
    await FOLLOWS.deleteMany({});
  });

  test('follow', async () => {
    await bSocialAfterInsert(followDoc);
    const follow = await FOLLOWS.findOne();
    expect(typeof follow).toBe('object');
    expect(follow._id).toBe(follow_id);
    expect(follow.txId).toBe(txId);
    expect(follow.idKey).toBe(idKey);
    expect(follow.follows).toBe('follow_id_key');
    expect(typeof follow.t).toBe('number');
  });

  test('unfollow', async () => {
    await bSocialAfterInsert(followDoc);
    const follow = await FOLLOWS.findOne();
    expect(typeof follow).toBe('object');
    expect(follow._id).toBe(follow_id);
    expect(follow.txId).toBe(txId);

    await bSocialAfterInsert(unFollowDoc);
    const follow2 = await FOLLOWS.findOne();
    expect(follow2).toBe(null);
  });
});

describe('bSocialAfterInsert payment', () => {
  beforeEach(async () => {
    await PAYMENTS.deleteMany({});
  });

  test('payment', async () => {
    const useDoc = {...doc};
    const address = '1K4c6YXR1ixNLAqrL8nx5HUQAPKbACTwDo';
    const addressId = bsv.crypto.Hash.sha256(Buffer.from(`${address}${tx}`)).toString('hex');

    useDoc.MAP[0].type = 'payment';
    useDoc.BPP = [
      {
        action: 'PAID',
        currency: 'txId',
        address: address,
        apiEndpoint: '<ECIES encrypted decryption key>',

  }
    ];
    await bSocialAfterInsert(useDoc);
    const payment = await PAYMENTS.findOne();
    expect(typeof payment).toBe('object');
    expect(payment._id).toBe(addressId);
    expect(payment.txId).toBe(txId);
    expect(payment.idKey).toBe(address);
    expect(payment.tx).toBe(tx);
    expect(payment.decryptionKey).toBe(useDoc.BPP[0].apiEndpoint);
  });
});

describe('bSocialAfterInsert friend', () => {
  beforeEach(async () => {
    await FRIENDS.deleteMany({});
  });

  test('friend', async () => {
    const useDoc = {...friendDoc};
    const _id = bsv.crypto.Hash.sha256(Buffer.from(`${idKey}${idKey2}`)).toString('hex');
    await bSocialAfterInsert(useDoc);
    const friend = await FRIENDS.findOne();
    expect(typeof friend).toBe('object');
    expect(friend._id).toBe(_id);
    expect(friend.txId).toBe(txId);
    expect(friend.idKey).toBe(idKey);
    expect(friend.friendIdKey).toBe(idKey2);
    expect(friend.publicKey).toBe('public key of friend 1');
  });

  test('friend + friend', async () => {
    const useDoc = {...friendDoc};
    const _id = bsv.crypto.Hash.sha256(Buffer.from(`${idKey}${idKey2}`)).toString('hex');
    await bSocialAfterInsert(useDoc);
    const friend = await FRIENDS.findOne({_id});
    expect(friend.idKey).toBe(idKey);
    expect(friend.friendIdKey).toBe(idKey2);
    expect(friend.publicKey).toBe('public key of friend 1');

    const useDoc2 = {...friend2Doc};
    const _id2 = bsv.crypto.Hash.sha256(Buffer.from(`${idKey2}${idKey}`)).toString('hex');
    await bSocialAfterInsert(useDoc2);
    const friend2 = await FRIENDS.findOne({_id: _id2});
    expect(friend2.idKey).toBe(idKey2);
    expect(friend2.friendIdKey).toBe(idKey);
    expect(friend2.publicKey).toBe('public key of friend 2');
    expect(friend2.accepted).toBe(txId);

    const friendAgain = await FRIENDS.findOne({_id});
    expect(friendAgain.accepted).toBe(tx2);
  });
});
