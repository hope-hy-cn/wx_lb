module.exports=MapField;var Field=require("./field");((MapField.prototype=Object.create(Field.prototype)).constructor=MapField).className="MapField";var types,util;function MapField(name,id,keyType,type,options,comment){Field.call(this,name,id,type,undefined,undefined,options,comment);if(!util.isString(keyType)){throw TypeError("keyType must be a string")}this.keyType=keyType;this.resolvedKeyType=null;this.map=true}MapField.fromJSON=function fromJSON(name,json){return new MapField(name,json.id,json.keyType,json.type,json.options,json.comment)};MapField.prototype.toJSON=function toJSON(toJSONOptions){var keepComments=toJSONOptions?Boolean(toJSONOptions.keepComments):false;return util.toObject(["keyType",this.keyType,"type",this.type,"id",this.id,"extend",this.extend,"options",this.options,"comment",keepComments?this.comment:undefined])};MapField.prototype.resolve=function resolve(){if(this.resolved){return this}if(types.mapKey[this.keyType]===undefined){throw Error("invalid key type: "+this.keyType)}return Field.prototype.resolve.call(this)};MapField.d=function decorateMapField(fieldId,fieldKeyType,fieldValueType){if(typeof fieldValueType==="function"){fieldValueType=util.decorateType(fieldValueType).name}else{if(fieldValueType&&typeof fieldValueType==="object"){fieldValueType=util.decorateEnum(fieldValueType).name}}return function mapFieldDecorator(prototype,fieldName){util.decorateType(prototype.constructor).add(new MapField(fieldName,fieldId,fieldKeyType,fieldValueType))}};MapField._configure=function(){types=require("./types");util=require("./util")};