import { HaiInfo } from "../../types/HaiInfo";

const haiKindNames: string[] = ["萬子", "索子", "筒子", ""];
const zihaiNames: string[] = ["東", "南", "西", "北", "白", "發", "中"];

export const GetHaiName = (hai: HaiInfo): string => {
    let ret = haiKindNames[hai.kind-1];
    if (hai.kind <= 3) {
        ret += hai.number;
    } else {
        ret += zihaiNames[hai.number-1];
    }
    return ret;
}

export const IsSameHai = (hai1:HaiInfo, hai2:HaiInfo):boolean => {
    if (hai1.kind == hai2.kind && hai1.number == hai2.number) {
        return true;
    } else {
        return false;
    }
}

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

// Fisher-Yatesシャッフルアルゴリズムを使用して配列をシャッフルする関数
export function ShuffleArray<T>(array: T[]): T[] {
    const shuffledArray = [...array]; // 元の配列をコピーする

    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // 0からiまでのランダムなインデックスを生成

        // 要素の入れ替え
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    return shuffledArray;
}