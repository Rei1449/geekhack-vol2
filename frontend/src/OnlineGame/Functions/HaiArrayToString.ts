import { HaiInfo } from "../../types/HaiInfo";
import { HaiToString } from "./HaiToString";

export const HaiArrayToString = (tehai: HaiInfo[]): string => {
    let ret: string[] = [];
    tehai.map((hai) => {
        ret.push(HaiToString(hai));
    })
    return ret.join(',');
}