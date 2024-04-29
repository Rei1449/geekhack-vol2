import { HaiInfo } from "../../types/HaiInfo";

export const SortHaiArray = (haiArray:HaiInfo[]): void => {
    haiArray.sort((hai1:HaiInfo, hai2:HaiInfo) => {
        if (hai1.kind < hai2.kind) {
            return -1;
        } else if (hai1.kind > hai2.kind) {
            return 1;
        }

        if (hai1.number < hai2.number) {
            return -1;
        } else if (hai1.number > hai2.number) {
            return 1;
        }

        return 0;
    })
}