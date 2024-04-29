import { HaiInfo } from "../../types/HaiInfo";
import ShuffleArray from "./ShuffleArray";

export default function makeYama(): HaiInfo[] {
	const yama: HaiInfo[] = [];
	// 数牌
	for (let kind = 1; kind <= 3; kind++) {
		for (let number = 1; number <= 9; number++) {
			for (let i = 0; i < 4; i++) {
				yama.push({ kind: kind, number: number });
			}
		}
	}
	// 字牌
	for (let number = 1; number <= 7; number++) {
		for (let i = 0; i < 4; i++) {
			yama.push({ kind: 4, number: number });
		}
	}
	return ShuffleArray(yama);
};