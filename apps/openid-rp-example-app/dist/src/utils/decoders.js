"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.booleanDecoder = void 0;
const D = __importStar(require("io-ts/Decoder"));
const E = __importStar(require("fp-ts/Either"));
const b = __importStar(require("fp-ts/boolean"));
const f = __importStar(require("fp-ts/function"));
const booleanDecoder = {
    decode: (str) => f.pipe(str, D.literal("true", "false").decode, E.map((x) => b.fold(f.constant(false), f.constant(true))(x === "true"))),
};
exports.booleanDecoder = booleanDecoder;
//# sourceMappingURL=decoders.js.map