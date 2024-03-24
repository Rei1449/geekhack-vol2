import { HaiInfo } from "../../types/HaiInfo"
import type { ResultData } from "../../types/ResultData";

export const UNDEFINED_HAI: HaiInfo = {kind: -1, number: -1};

export const ENDPOINT_URL: string = "http://localhost:8080/";

export const aiNames: string[] = ["llama", "chatgpt", "gemini"];

export const UNDEFINED_RESULT_DATA: ResultData = {
    hand: "1,2,3",
    id: 1,
    score: 10000,
    user_name: "user",
    ai: "AI",
    updated_at: "2024",
    created_at: "2024",
};

export const USER_NAME_KEY: string = "user_name";