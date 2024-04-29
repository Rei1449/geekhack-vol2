import { useState } from "react";
import { HaiInfo } from "../types/HaiInfo";
import makeYama from "./Functions/MakeYama";
import { UNDEFINED_HAI, USER_NAME_KEY, WS_URL } from "./constants";
import { useLocation } from "react-router-dom";
import { HaiToString } from "./Functions/HaiToString";
import { StringToHaiArray } from "./Functions/StringToHaiArray";
import { StringToHai } from "./Functions/StringToHai";
import { IsSameHai } from "./Functions/IsSameHai";
import { SortHaiArray } from "./Functions/SortHaiArray";

type Input = {
    users: string[],
    isGM: boolean,
    room_id: string,
};

type NameAndTehai = {
    user_name: string,
    tehai: string,
};

type HaiPai = {
    room_id: string,
    haipai: NameAndTehai[],
};

const sendHaipai = async (haipai: HaiPai) => {
    const res = await fetch(WS_URL + "??????", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(haipai),
    });
    if (res.ok) {
        const data = await res.json();
        console.log(data.tehai);
    } else {
        console.log("error");
    }
};

const sendTumoHai = async (room_id: string, user_name: string, hai: HaiInfo) => {
    const res = await fetch(WS_URL + "??????", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            room_id: room_id,
            user_name: user_name,
            hai: HaiToString(hai)}),
    });
    if (res.ok) {
        const data = await res.json();
        console.log(data);
    } else {
        console.log("error");
    }
};

const sendDiscardHai = async (room_id: string, user_name: string, hai: HaiInfo) => {
    const res = await fetch(WS_URL + "??????", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            room_id: room_id,
            user_name: user_name,
            hai: HaiToString(hai)}),
    });
    if (res.ok) {
        const data = await res.json();
        console.log(data);
    } else {
        console.log("error");
    }
};

const OnLineGame = () => {
    const location = useLocation();

    // 定数定義
    const room_id = location.state as Input["room_id"];
    const isGM = location.state as Input["isGM"];
    const users = location.state as Input["users"];
    const user: string = localStorage.getItem(USER_NAME_KEY) || "NoUser";

    // state定義
    const [yama, setYama] = useState<HaiInfo[]>([]);
    const [playerTehai, setPlayerTehai] = useState<HaiInfo[]>([]);
    const [isMyTurn, setIsMyTurn] = useState<boolean>(false);
    const [kawas, setKawas] = useState<HaiInfo[][]>([[], [], [], []]);

    // WebSocket定義
    const catchHaipai = new WebSocket(WS_URL+"?????");
    catchHaipai.onmessage = function (event) {
        const data = event.data;
        setPlayerTehai(StringToHaiArray(data));
        if (isGM) {
            sendTumoHai(room_id, users[0], popYama());
        }
    };

    const catchTumoHai = new WebSocket(WS_URL+"?????");
    catchTumoHai.onmessage = function (event) {
        const data = event.data;
        setYama([...yama, StringToHai(data.hai)]);
        setIsMyTurn(true);
    }

    // 関数定義
    const popYama = (): HaiInfo => {
		const lastHai: HaiInfo | undefined = yama.pop();
		const newYama = [...yama];
		setYama(newYama);
		return lastHai || UNDEFINED_HAI;
	};

    const discard = (targetHai: HaiInfo): boolean => {
		const newPlayerTehai = playerTehai;
		for (let i = 0; i < playerTehai.length; i++) {
			if (IsSameHai(targetHai, playerTehai[i])) {
				newPlayerTehai.splice(i, 1);
				SortHaiArray(newPlayerTehai);
				setPlayerTehai(newPlayerTehai);
                sendDiscardHai(room_id, user, targetHai);
				return true;
			}
		}
		return false;
	};

    const startGame = (): void => {
        const newYama = makeYama();
        const haipai:NameAndTehai[] = [];
        for (let i = 0; i < 4; i++) {
            let tmp:string[] = [];
            for (let j = 0; j < 13; j++) {
                const hai = newYama.pop();
                tmp.push(HaiToString(hai || UNDEFINED_HAI));
            }
            haipai.push({user_name: users[i], tehai: tmp.join(',')});
        }
        sendHaipai({room_id: room_id, haipai: haipai});
    }

    return (
        <>
            <button onClick={startGame}>ゲーム開始</button>
        </>
    )
}

export default OnLineGame;