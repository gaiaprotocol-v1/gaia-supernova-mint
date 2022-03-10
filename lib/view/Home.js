"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const skynode_1 = require("@hanul/skynode");
const ethers_1 = require("ethers");
const msg_js_1 = __importDefault(require("msg.js"));
const BrowserInfo_1 = __importDefault(require("../BrowserInfo"));
const CommonUtil_1 = __importDefault(require("../CommonUtil"));
const Alert_1 = __importDefault(require("../component/dialogue/Alert"));
const GaiaKronosContract_1 = __importDefault(require("../contracts/GaiaKronosContract"));
const GaiaSupernovaContract_1 = __importDefault(require("../contracts/GaiaSupernovaContract"));
const SupernovaMinterContract_1 = __importDefault(require("../contracts/SupernovaMinterContract"));
const Klaytn_1 = __importDefault(require("../klaytn/Klaytn"));
const Wallet_1 = __importDefault(require("../klaytn/Wallet"));
class Landing {
    constructor() {
        this.TODAY_COUNT = 1000;
        this.STATUS = {
            Waiting: (0, msg_js_1.default)("MINT_STATUS_TITLE1"),
            WhitelistMinting: (0, msg_js_1.default)("MINT_STATUS_TITLE2"),
            PublicMinting: (0, msg_js_1.default)("MINT_STATUS_TITLE3"),
            Ending: (0, msg_js_1.default)("MINT_STATUS_TITLE4"),
        };
        this.status = (0, msg_js_1.default)("MINT_STATUS_TITLE1");
        document.title = (0, msg_js_1.default)("TITLE");
        let select;
        skynode_1.BodyNode.append((this.container = (0, skynode_1.el)(".home-view", (0, skynode_1.el)("img.logo", { src: "/images/logo.png", alt: "super nova logo" }), (0, skynode_1.el)(".price", (0, msg_js_1.default)("MINT_PRICE_TITLE")), select = (0, skynode_1.el)("select.language-select", (0, skynode_1.el)("option", "한국어 🇰🇷 ", { value: "ko" }), (0, skynode_1.el)("option", "English 🇺🇸 ", { value: "en" }), {
            change: () => {
                BrowserInfo_1.default.changeLanguage(select.domElement.value);
            },
        }), (0, skynode_1.el)(".mint-info", this.mintStatus = (0, skynode_1.el)(".progress-text"), this.mintCount = (0, skynode_1.el)(".progress-text")), (0, skynode_1.el)(".progress", this.bar = (0, skynode_1.el)(".progress__bar")), (0, skynode_1.el)(".info", (0, skynode_1.el)(".caption", (0, msg_js_1.default)("ADDRESS_TITLE")), this.walletAddress = (0, skynode_1.el)("p", "..."), (0, skynode_1.el)(".caption", (0, msg_js_1.default)("KLAY_AMOUNT_TITLE")), this.klayBalance = (0, skynode_1.el)("p", "..."), (0, skynode_1.el)(".caption", (0, msg_js_1.default)("WHITELIST_TITLE")), this.passCount = (0, skynode_1.el)("p", "..."), (0, skynode_1.el)(".warning", (0, msg_js_1.default)("WHITELIST_DESC"))), (0, skynode_1.el)("button", (0, msg_js_1.default)("MINT_BUTTON"), {
            click: async () => {
                if (this.status === this.STATUS.WhitelistMinting) {
                    await SupernovaMinterContract_1.default.initialMint(1);
                }
                else if (this.status === this.STATUS.PublicMinting) {
                    await SupernovaMinterContract_1.default.publicMint(1);
                }
                else {
                    new Alert_1.default((0, msg_js_1.default)("ERROR_POPUP_TITLE"), (0, msg_js_1.default)("MINT_ERROR_POPUP_DESC"));
                }
            },
        }), (0, skynode_1.el)(".sns", (0, skynode_1.el)("a", (0, msg_js_1.default)("HOMEPAGE_BUTTON"), { href: "https://gaiasupernova.com", target: "_blank" }), (0, skynode_1.el)("a", (0, msg_js_1.default)("OPENSEA_BUTTON"), { href: "https://opensea.io/collection/gaia-kronos", target: "_blank" })))));
        select.domElement.value = BrowserInfo_1.default.language;
        Wallet_1.default.on("connect", () => this.loadBalance());
        this.interval = setInterval(() => this.progress(), 1000);
    }
    async loadBalance() {
        const address = await Wallet_1.default.loadAddress();
        if (address !== undefined) {
            this.walletAddress.empty().appendText(CommonUtil_1.default.shortenAddress(address));
            const balance = await Klaytn_1.default.balanceOf(address);
            this.klayBalance.empty().appendText(ethers_1.utils.formatEther(balance));
            const passCount = (await GaiaKronosContract_1.default.balanceOf(address)).toNumber();
            this.passCount.empty().appendText(`${passCount}`);
        }
    }
    async loadStatus() {
        if (await SupernovaMinterContract_1.default.initialSale() === true) {
            this.status = this.STATUS.WhitelistMinting;
        }
        else if (await SupernovaMinterContract_1.default.publicSale() === true) {
            this.status = this.STATUS.PublicMinting;
        }
        else if ((await GaiaSupernovaContract_1.default.totalSupply()).eq(1000)) {
            this.status = this.STATUS.Ending;
        }
        else {
            this.status = this.STATUS.Waiting;
        }
        this.mintStatus.empty().appendText(this.status);
    }
    async progress() {
        this.loadStatus();
        this.loadBalance();
        const d = (await GaiaSupernovaContract_1.default.totalSupply()).toNumber();
        this.bar.style({ width: `${d / this.TODAY_COUNT * 100}%` });
        this.mintCount.empty().appendText(`${d}/${this.TODAY_COUNT}`);
    }
    changeParams(params, uri) { }
    close() {
        clearInterval(this.interval);
        this.container.delete();
    }
}
exports.default = Landing;
//# sourceMappingURL=Home.js.map