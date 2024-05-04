import { HaiInfo } from "../../types/HaiInfo";
import { StringToHai } from "./StringToHai";

export const StringToHaiArray = (tehai: string): HaiInfo[] => {
    const ret: HaiInfo[] = [];
    tehai.split(',').map((hai: string) => {
        ret.push(StringToHai(hai));
    })
    return ret;
}