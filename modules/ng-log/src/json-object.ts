/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

export type JsonAstNode = JsonAstNumber
    | JsonAstString
    | JsonAstArray
    | JsonAstObject
    | JsonAstConstantFalse
    | JsonAstConstantNull
    | JsonAstConstantTrue;

export interface JsonAstNumber {
    readonly kind: 'number';
    readonly value: number;
}

export interface JsonAstString {
    readonly kind: 'string';
    readonly value: string;
}

export interface JsonAstArray {
    readonly kind: 'array';
    readonly elements: JsonAstNode[];
    readonly value: JsonArray;
}

export interface JsonAstKeyValue {
    readonly kind: 'keyvalue';
    readonly key: JsonAstString;
    readonly value: JsonAstNode;
}

export interface JsonAstObject {
    readonly kind: 'object';
    readonly properties: JsonAstKeyValue[];
    readonly value: JsonObject;
}

export interface JsonAstConstantFalse {
    readonly kind: 'false';
    readonly value: false;
}

export interface JsonAstConstantNull {
    readonly kind: 'null';
    readonly value: null;
}

export interface JsonAstConstantTrue {
    readonly kind: 'true';
    readonly value: true;
}

export type JsonValue = JsonAstNode['value'];

export interface JsonArray extends Array<JsonValue> { }

export interface JsonObject {
    [prop: string]: JsonValue;
}
