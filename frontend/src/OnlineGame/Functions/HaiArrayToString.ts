import { HaiInfo } from "../../types/HaiInfo";
import { HaiToString } from "./HaiToString";

export const HaiArrayToString = (tehai: HaiInfo[]): string => {
    let ret: string = "";
    tehai.map((hai) => {
        ret += HaiToString(hai);
    })
    return ret;
}