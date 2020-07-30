module.exports=Namespace;var ReflectionObject=require("./object");((Namespace.prototype=Object.create(ReflectionObject.prototype)).constructor=Namespace).className="Namespace";var Enum,Field,util;var Type;var Service;Namespace.fromJSON=function fromJSON(name,json){return new Namespace(name,json.options).addJSON(json.nested)};function arrayToJSON(array,toJSONOptions){if(!(array&&array.length)){return undefined}var obj={};for(var i=0;i<array.length;++i){obj[array[i].name]=array[i].toJSON(toJSONOptions)}return obj}Namespace.arrayToJSON=arrayToJSON;Namespace.isReservedId=function isReservedId(reserved,id){if(reserved){for(var i=0;i<reserved.length;++i){if(typeof reserved[i]!=="string"&&reserved[i][0]<=id&&reserved[i][1]>=id){return true}}}return false};Namespace.isReservedName=function isReservedName(reserved,name){if(reserved){for(var i=0;i<reserved.length;++i){if(reserved[i]===name){return true}}}return false};function Namespace(name,options){ReflectionObject.call(this,name,options);this.nested=undefined;this._nestedArray=null}function clearCache(namespace){namespace._nestedArray=null;return namespace}Object.defineProperty(Namespace.prototype,"nestedArray",{get:function(){return this._nestedArray||(this._nestedArray=util.toArray(this.nested))}});Namespace.prototype.toJSON=function toJSON(toJSONOptions){return util.toObject(["options",this.options,"nested",arrayToJSON(this.nestedArray,toJSONOptions)])};Namespace.prototype.addJSON=function addJSON(nestedJson){var ns=this;if(nestedJson){for(var names=Object.keys(nestedJson),i=0,nested;i<names.length;++i){nested=nestedJson[names[i]];ns.add((nested.fields!==undefined?Type.fromJSON:nested.values!==undefined?Enum.fromJSON:nested.methods!==undefined?Service.fromJSON:nested.id!==undefined?Field.fromJSON:Namespace.fromJSON)(names[i],nested))}}return this};Namespace.prototype.get=function get(name){return this.nested&&this.nested[name]||null};Namespace.prototype.getEnum=function getEnum(name){if(this.nested&&this.nested[name] instanceof Enum){return this.nested[name].values}throw Error("no such enum: "+name)};Namespace.prototype.add=function add(object){if(!(object instanceof Field&&object.extend!==undefined||object instanceof Type||object instanceof Enum||object instanceof Service||object instanceof Namespace)){throw TypeError("object must be a valid nested object")}if(!this.nested){this.nested={}}else{var prev=this.get(object.name);if(prev){if(prev instanceof Namespace&&object instanceof Namespace&&!(prev instanceof Type||prev instanceof Service)){var nested=prev.nestedArray;for(var i=0;i<nested.length;++i){object.add(nested[i])}this.remove(prev);if(!this.nested){this.nested={}}object.setOptions(prev.options,true)}else{throw Error("duplicate name '"+object.name+"' in "+this)}}}this.nested[object.name]=object;object.onAdd(this);return clearCache(this)};Namespace.prototype.remove=function remove(object){if(!(object instanceof ReflectionObject)){throw TypeError("object must be a ReflectionObject")}if(object.parent!==this){throw Error(object+" is not a member of "+this)}delete this.nested[object.name];if(!Object.keys(this.nested).length){this.nested=undefined}object.onRemove(this);return clearCache(this)};Namespace.prototype.define=function define(path,json){if(util.isString(path)){path=path.split(".")}else{if(!Array.isArray(path)){throw TypeError("illegal path")}}if(path&&path.length&&path[0]===""){throw Error("path must be relative")}var ptr=this;while(path.length>0){var part=path.shift();if(ptr.nested&&ptr.nested[part]){ptr=ptr.nested[part];if(!(ptr instanceof Namespace)){throw Error("path conflicts with non-namespace objects")}}else{ptr.add(ptr=new Namespace(part))}}if(json){ptr.addJSON(json)}return ptr};Namespace.prototype.resolveAll=function resolveAll(){var nested=this.nestedArray,i=0;while(i<nested.length){if(nested[i] instanceof Namespace){nested[i++].resolveAll()}else{nested[i++].resolve()}}return this.resolve()};Namespace.prototype.lookup=function lookup(path,filterTypes,parentAlreadyChecked){if(typeof filterTypes==="boolean"){parentAlreadyChecked=filterTypes;filterTypes=undefined}else{if(filterTypes&&!Array.isArray(filterTypes)){filterTypes=[filterTypes]}}if(util.isString(path)&&path.length){if(path==="."){return this.root}path=path.split(".")}else{if(!path.length){return this}}if(path[0]===""){return this.root.lookup(path.slice(1),filterTypes)}var found=this.get(path[0]);if(found){if(path.length===1){if(!filterTypes||filterTypes.indexOf(found.constructor)>-1){return found}}else{if(found instanceof Namespace&&(found=found.lookup(path.slice(1),filterTypes,true))){return found}}}else{for(var i=0;i<this.nestedArray.length;++i){if(this._nestedArray[i] instanceof Namespace&&(found=this._nestedArray[i].lookup(path,filterTypes,true))){return found}}}if(this.parent===null||parentAlreadyChecked){return null}return this.parent.lookup(path,filterTypes)};Namespace.prototype.lookupType=function lookupType(path){var found=this.lookup(path,[Type]);if(!found){throw Error("no such type: "+path)
}return found};Namespace.prototype.lookupEnum=function lookupEnum(path){var found=this.lookup(path,[Enum]);if(!found){throw Error("no such Enum '"+path+"' in "+this)}return found};Namespace.prototype.lookupTypeOrEnum=function lookupTypeOrEnum(path){var found=this.lookup(path,[Type,Enum]);if(!found){throw Error("no such Type or Enum '"+path+"' in "+this)}return found};Namespace.prototype.lookupService=function lookupService(path){var found=this.lookup(path,[Service]);if(!found){throw Error("no such Service '"+path+"' in "+this)}return found};Namespace._configure=function(){Enum=require("./enum");Field=require("./field");util=require("./util");Type=require("./type");Service=require("./service")};