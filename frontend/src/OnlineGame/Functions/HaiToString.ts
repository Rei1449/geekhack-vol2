import { HaiInfo } from "../../types/HaiInfo";

export const HaiToString = (hai: HaiInfo): string => {
    return hai.kind.toString() + hai.number.toString();
}