"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const Config_1 = __importDefault(require("../Config"));
const KIP17Contract_1 = __importDefault(require("./standard/KIP17Contract"));
class GaiaKronosContract extends KIP17Contract_1.default {
    constructor() {
        super(Config_1.default.contracts.GaiaKronos);
    }
    async totalSupply() {
        return ethers_1.BigNumber.from(await this.runMethod("totalSupply"));
    }
}
exports.default = new GaiaKronosContract();
//# sourceMappingURL=GaiaKronosContract.js.map