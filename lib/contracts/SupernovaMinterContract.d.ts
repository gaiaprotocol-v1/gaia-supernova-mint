import { BigNumber } from "ethers";
import Contract from "./Contract";
declare class SupernovaMinterContract extends Contract {
    constructor();
    initialSale(): Promise<boolean>;
    publicSale(): Promise<boolean>;
    supernovaPrice(): Promise<BigNumber>;
    initialMint(count: number): Promise<void>;
    publicMint(count: number): Promise<void>;
}
declare const _default: SupernovaMinterContract;
export default _default;
//# sourceMappingURL=SupernovaMinterContract.d.ts.map