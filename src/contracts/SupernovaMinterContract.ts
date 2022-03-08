import { BigNumber } from "ethers";
import msg from "msg.js";
import Alert from "../component/dialogue/Alert";
import Config from "../Config";
import Klaytn from "../klaytn/Klaytn";
import Wallet from "../klaytn/Wallet";
import SupernovaMinterArtifact from "./abi/artifacts/contracts/SupernovaMinter.sol/SupernovaMinter.json";
import Contract from "./Contract";
import GaiaKronosContract from "./GaiaKronosContract";
import GaiaSupernovaContract from "./GaiaSupernovaContract";

class SupernovaMinterContract extends Contract {

    constructor() {
        super(Config.contracts.SupernovaMinter, SupernovaMinterArtifact.abi);
    }

    public async initialSale(): Promise<boolean> {
        return await this.runMethod("initialSale");
    }

    public async publicSale(): Promise<boolean> {
        return await this.runMethod("publicSale");
    }

    public async supernovaPrice(): Promise<BigNumber> {
        return BigNumber.from(await this.runMethod("supernovaPrice"));
    }

    public async initialMint(count: number): Promise<void> {
        const address = await Wallet.loadAddress();
        if (address !== undefined) {
            const totalSupply = (await GaiaSupernovaContract.totalSupply()).toNumber();
            const whitelist = (await GaiaKronosContract.totalSupply()).toNumber();
            if (count > 1000 - totalSupply) {
                new Alert(msg("ERROR_POPUP_TITLE"), msg("ERROR_ALERT_DESC1").replace(/{supply}/, String(1000 - totalSupply)));
            } else if (count > whitelist) {
                new Alert(msg("ERROR_POPUP_TITLE"), msg("ERROR_ALERT_DESC2").replace(/{whitelist}/, String(whitelist)));
            } else {
                const price = (await this.supernovaPrice()).mul(count);
                const balance = await Klaytn.balanceOf(address);
                if (balance.lt(price)) {
                    new Alert(msg("ERROR_POPUP_TITLE"), msg("ERROR_ALERT_DESC3"));
                } else {
                    await this.runWalletMethodWithValue(price, "initialMint", count);
                    setTimeout(() => {
                        new Alert(msg("SUCCESS_ALERT_TITLE"), msg("SUCCESS_ALERT_DESC"));
                    }, 2000);
                }
            }
        }
    }

    public async publicMint(count: number): Promise<void> {
        const address = await Wallet.loadAddress();
        if (address !== undefined) {
            const totalSupply = (await GaiaSupernovaContract.totalSupply()).toNumber();
            if (count > 1000 - totalSupply) {
                new Alert("오류", `남은 개수는 ${1000 - totalSupply}개입니다.`);
            } else {
                const price = (await this.supernovaPrice()).mul(count);
                const balance = await Klaytn.balanceOf(address);
                if (balance.lt(price)) {
                    new Alert("오류", "Klay가 부족합니다.");
                } else {
                    await this.runWalletMethodWithValue(price, "publicMint", count);
                    setTimeout(() => {
                        new Alert("민팅 성공!", "민팅에 성공했습니다. 민팅한 NFT는 오픈씨에서 확인이 가능합니다.");
                    }, 2000);
                }
            }
        }
    }
}

export default new SupernovaMinterContract();
