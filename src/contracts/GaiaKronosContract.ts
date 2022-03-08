import { BigNumber } from "ethers";
import Config from "../Config";
import KIP17Contract from "./standard/KIP17Contract";

class GaiaKronosContract extends KIP17Contract {

    constructor() {
        super(Config.contracts.GaiaKronos);
    }

    public async totalSupply(): Promise<BigNumber> {
        return BigNumber.from(await this.runMethod("totalSupply"));
    }
}

export default new GaiaKronosContract();
