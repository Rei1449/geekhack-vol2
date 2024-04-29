import { HaiInfo } from "../../types/HaiInfo";

const haiKindNames: string[] = ["萬子", "索子", "筒子", ""];
const zihaiNames: string[] = ["東", "南", "西", "北", "白", "發", "中"];

export const getHaiName = (hai: HaiInfo): string => {
    let ret = haiKindNames[hai.kind-1];
    if (hai.kind <= 3) {
        ret += hai.number;
    } else {
        ret += zihaiNames[hai.number-1];
    }
    return ret;
}