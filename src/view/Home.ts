import { BodyNode, DomNode, el } from "@hanul/skynode";
import { utils } from "ethers";
import msg from "msg.js";
import { View, ViewParams } from "skyrouter";
import BrowserInfo from "../BrowserInfo";
import CommonUtil from "../CommonUtil";
import Alert from "../component/dialogue/Alert";
import GaiaKronosContract from "../contracts/GaiaKronosContract";
import GaiaSupernovaContract from "../contracts/GaiaSupernovaContract";
import SupernovaMinterContract from "../contracts/SupernovaMinterContract";
import Klaytn from "../klaytn/Klaytn";
import Wallet from "../klaytn/Wallet";

export default class Landing implements View {

    private TODAY_COUNT = 1000;

    private STATUS = {
        Waiting: msg("MINT_STATUS_TITLE1"),
        WhitelistMinting: msg("MINT_STATUS_TITLE2"),
        PublicMinting: msg("MINT_STATUS_TITLE3"),
        Ending: msg("MINT_STATUS_TITLE4"),
    };

    private status = msg("MINT_STATUS_TITLE1");

    private container: DomNode;
    private interval: any;

    private klayBalance: DomNode;
    private passCount: DomNode;
    private mintCount: DomNode;
    private mintStatus: DomNode;
    private walletAddress: DomNode;
    private bar: DomNode;

    constructor() {
        document.title = msg("TITLE");
        let select: DomNode<HTMLSelectElement>;

        BodyNode.append(
            (this.container = el(".home-view",
                el("img.logo", { src: "/images/logo.png", alt: "super nova logo" }),
                el(".price", msg("MINT_PRICE_TITLE")),
                select = el("select.language-select",
                    el("option", "한국어 🇰🇷 ", { value: "ko" }),
                    el("option", "English 🇺🇸 ", { value: "en" }),
                    {
                        change: () => {
                            BrowserInfo.changeLanguage(select.domElement.value);
                        },
                    },
                ),
                el(".mint-info",
                    this.mintStatus = el(".progress-text"),
                    this.mintCount = el(".progress-text"),
                ),
                el(".progress",
                    this.bar = el(".progress__bar"),
                ),
                el(".info",
                    el(".caption", msg("ADDRESS_TITLE")),
                    this.walletAddress = el("p", "..."),
                    el(".caption", msg("KLAY_AMOUNT_TITLE")),
                    this.klayBalance = el("p", "..."),
                    el(".caption", msg("WHITELIST_TITLE")),
                    this.passCount = el("p", "..."),
                    el(".warning", msg("WHITELIST_DESC")),
                ),
                el("button", msg("MINT_BUTTON"), {
                    click: async () => {
                        let count = 1;
                        if (isNaN(count)) { count = 1; }
                        if (this.status === this.STATUS.WhitelistMinting) {
                            if (count > 5) {
                                new Alert(msg("ERROR_POPUP_TITLE"), msg("ERROR_ALERT_DESC4"));
                            } else {
                            }
                        } else if (this.status === this.STATUS.PublicMinting) {
                            if (count > 10) {
                                new Alert(msg("ERROR_POPUP_TITLE"), msg("ERROR_ALERT_DESC5"));
                            } else {
                            }
                        } else {
                            new Alert(msg("ERROR_POPUP_TITLE"), msg("MINT_ERROR_POPUP_DESC"));
                        }
                    },
                }),
                el(".sns",
                    el("a", msg("HOMEPAGE_BUTTON"), { href: "https://gaiasupernova.com", target: "_blank" }),
                    el("a", msg("OPENSEA_BUTTON"), { href: "https://opensea.io/collection/gaia-kronos", target: "_blank" }),
                ),
            ))
        );

        select.domElement.value = BrowserInfo.language;
        Wallet.on("connect", () => this.loadBalance());
        this.interval = setInterval(() => this.progress(), 1000);
    }

    private async loadBalance() {
        const address = await Wallet.loadAddress();
        if (address !== undefined) {
            this.walletAddress.empty().appendText(CommonUtil.shortenAddress(address));

            const balance = await Klaytn.balanceOf(address);
            this.klayBalance.empty().appendText(utils.formatEther(balance!));

            const passCount = (await GaiaKronosContract.balanceOf(address)).toNumber();
            this.passCount.empty().appendText(`${passCount}`)
        }
    }

    private async loadStatus() {
        if (await SupernovaMinterContract.initialSale() === true) {
            this.status = this.STATUS.WhitelistMinting;
        } else if (await SupernovaMinterContract.publicSale() === true) {
            this.status = this.STATUS.PublicMinting;
        } else if ((await GaiaSupernovaContract.totalSupply()).eq(1000)) {
            this.status = this.STATUS.Ending;
        } else {
            this.status = this.STATUS.Waiting;
        }
        this.mintStatus.empty().appendText(this.status);
    }

    private async progress() {

        this.loadStatus();
        this.loadBalance();

        const d = (await GaiaSupernovaContract.totalSupply()).toNumber();
        this.bar.style({ width: `${d / this.TODAY_COUNT * 100}%` });
        this.mintCount.empty().appendText(`${d}/${this.TODAY_COUNT}`);
    }

    public changeParams(params: ViewParams, uri: string): void { }

    public close(): void {
        clearInterval(this.interval);
        this.container.delete();
    }
}
