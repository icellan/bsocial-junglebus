"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:!0}),exports.PAYMENTS=void 0;var _simplSchema=_interopRequireDefault(require("simpl-schema")),_collection=require("../lib/collection"),PAYMENTS=new _collection.Collection("bsocial-payments",new _simplSchema.default({txId:{type:String},idKey:{type:String,optional:!1},address:{type:String,optional:!1},decryptionKey:{type:String,optional:!1},tx:{type:String,optional:!1},t:{type:_simplSchema.default.Integer,optional:!1}}));exports.PAYMENTS=PAYMENTS;