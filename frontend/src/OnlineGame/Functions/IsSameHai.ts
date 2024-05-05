import { HaiInfo } from "../../types/HaiInfo";

export const IsSameHai = (hai1:HaiInfo, hai2:HaiInfo):boolean => {
    if (hai1.kind == hai2.kind && hai1.number == hai2.number) {
        return true;
    } else {
        return false;
    }
}