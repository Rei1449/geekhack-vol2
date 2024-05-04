import { HaiInfo } from "../../types/HaiInfo";

export const StringToHai = (hai: string): HaiInfo => {
    return {kind: parseInt(hai[0]), number: parseInt(hai[1])};
}