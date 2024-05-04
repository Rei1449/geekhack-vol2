// Fisher-Yatesシャッフルアルゴリズムを使用して配列をシャッフルする関数
export default function ShuffleArray<T>(array: T[]): T[] {
    const shuffledArray = [...array]; // 元の配列をコピーする

    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // 0からiまでのランダムなインデックスを生成

        // 要素の入れ替え
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    return shuffledArray;
}