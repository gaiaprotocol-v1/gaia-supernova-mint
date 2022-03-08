"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const msg_js_1 = __importDefault(require("msg.js"));
const Alert_1 = __importDefault(require("../component/dialogue/Alert"));
const Config_1 = __importDefault(require("../Config"));
const Klaytn_1 = __importDefault(require("../klaytn/Klaytn"));
const Wallet_1 = __importDefault(require("../klaytn/Wallet"));
const SupernovaMinter_json_1 = __importDefault(require("./abi/artifacts/contracts/SupernovaMinter.sol/SupernovaMinter.json"));
const Contract_1 = __importDefault(require("./Contract"));
const GaiaKronosContract_1 = __importDefault(require("./GaiaKronosContract"));
const GaiaSupernovaContract_1 = __importDefault(require("./GaiaSupernovaContract"));
class SupernovaMinterContract extends Contract_1.default {
    constructor() {
        super(Config_1.default.contracts.SupernovaMinter, SupernovaMinter_json_1.default.abi);
    }
    async initialSale() {
        return await this.runMethod("initialSale");
    }
    async publicSale() {
        return await this.runMethod("publicSale");
    }
    async supernovaPrice() {
        return ethers_1.BigNumber.from(await this.runMethod("supernovaPrice"));
    }
    async initialMint(count) {
        const address = await Wallet_1.default.loadAddress();
        if (address !== undefined) {
            const totalSupply = (await GaiaSupernovaContract_1.default.totalSupply()).toNumber();
            const whitelist = (await GaiaKronosContract_1.default.totalSupply()).toNumber();
            if (count > 1000 - totalSupply) {
                new Alert_1.default((0, msg_js_1.default)("ERROR_POPUP_TITLE"), (0, msg_js_1.default)("ERROR_ALERT_DESC1").replace(/{supply}/, String(1000 - totalSupply)));
            }
            else if (count > whitelist) {
                new Alert_1.default((0, msg_js_1.default)("ERROR_POPUP_TITLE"), (0, msg_js_1.default)("ERROR_ALERT_DESC2").replace(/{whitelist}/, String(whitelist)));
            }
            else {
                const price = (await this.supernovaPrice()).mul(count);
                const balance = await Klaytn_1.default.balanceOf(address);
                if (balance.lt(price)) {
                    new Alert_1.default((0, msg_js_1.default)("ERROR_POPUP_TITLE"), (0, msg_js_1.default)("ERROR_ALERT_DESC3"));
                }
                else {
                    await this.runWalletMethodWithValue(price, "initialMint", count);
                    setTimeout(() => {
                        new Alert_1.default((0, msg_js_1.default)("SUCCESS_ALERT_TITLE"), (0, msg_js_1.default)("SUCCESS_ALERT_DESC"));
                    }, 2000);
                }
            }
        }
    }
    async publicMint(count) {
        const address = await Wallet_1.default.loadAddress();
        if (address !== undefined) {
            const totalSupply = (await GaiaSupernovaContract_1.default.totalSupply()).toNumber();
            if (count > 1000 - totalSupply) {
                new Alert_1.default("오류", `남은 개수는 ${1000 - totalSupply}개입니다.`);
            }
            else {
                const price = (await this.supernovaPrice()).mul(count);
                const balance = await Klaytn_1.default.balanceOf(address);
                if (balance.lt(price)) {
                    new Alert_1.default("오류", "Klay가 부족합니다.");
                }
                else {
                    await this.runWalletMethodWithValue(price, "publicMint", count);
                    setTimeout(() => {
                        new Alert_1.default("민팅 성공!", "민팅에 성공했습니다. 민팅한 NFT는 오픈씨에서 확인이 가능합니다.");
                    }, 2000);
                }
            }
        }
    }
}
exports.default = new SupernovaMinterContract();
//# sourceMappingURL=SupernovaMinterContract.js.map