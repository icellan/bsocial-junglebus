"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:!0}),exports.getDB=void 0;var _asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_mongodb=_interopRequireDefault(require("mongodb")),_config=require("../config"),db=null,getDB=function(){var a=(0,_asyncToGenerator2.default)(function*(){var a=!!(0<arguments.length&&arguments[0]!==void 0)&&arguments[0];if(!db){var b=new _mongodb.default.MongoClient(a||_config.mongoUrl,{useNewUrlParser:!0,useUnifiedTopology:!0,keepAlive:1});yield b.connect().catch(a=>{console.log(a),process.exit(-1)}),db=b.db(_config.dbName)}return db});return function(){return a.apply(this,arguments)}}();exports.getDB=getDB;