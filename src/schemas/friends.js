import SimpleSchema from 'simpl-schema';
import { Collection } from '../lib/collection';

export const FRIENDS = new Collection('bsocial-friends', new SimpleSchema({
  txId: {
    type: String,
  },
  idKey: {
    type: String,
  },
  friendIdKey: {
    type: String,
  },
  publicKey: {
    type: String,
  },
  accepted: {
    type: String,
  },
  t: {
    type: SimpleSchema.Integer,
  },
}));
