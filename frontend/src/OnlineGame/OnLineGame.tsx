import { useState } from "react";
import { HaiInfo } from "../types/HaiInfo";
import makeYama from "./Functions/MakeYama";
import { AI_NAMES, ENDPOINT_URL, UNDEFINED_HAI, USER_NAME_KEY, WS_URL } from "./constants";
import { useLocation } from "react-router-dom";
import { HaiToString } from "./Functions/HaiToString";
import { StringToHaiArray } from "./Functions/StringToHaiArray";
import { StringToHai } from "./Functions/StringToHai";
import { IsSameHai } from "./Functions/IsSameHai";
import { SortHaiArray } from "./Functions/SortHaiArray";
import { GetHaiName } from "./Functions/GetHaiName";
import { HaiArrayToString } from "./Functions/HaiArrayToString";

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
            hai: HaiToString(hai),
        })
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
            hai: HaiToString(hai),
        })
    });
    if (res.ok) {
        const data = await res.json();
        console.log(data);
    } else {
        console.log("error");
    }
};

const sendAgariUser = async (room_id: string, user_name: string) => {
    const res = await fetch(WS_URL + "??????", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            room_id: room_id,
            user_name: user_name,
        }),
    });
    if (res.ok) {
        const data = await res.json();
        console.log(data);
    } else {
        console.log("error");
    }
}

const sendPoint = async (room_id: string, user_name: string, tehai: HaiInfo[], point: string) => {
    const res = await fetch(WS_URL + "??????", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            room_id: room_id,
            user_name: user_name,
            tehai: HaiArrayToString(tehai),
            point: point,
        }),
    });
    if (res.ok) {
        const data = await res.json();
        console.log(data);
    } else {
        console.log("error");
    }
}

const calcPoint = async (room_id: string, user_name: string, tehai: HaiInfo[], ai_id: number) => {
    const stringTehai: string[] = [];
    SortHaiArray(tehai);
    tehai.map((hai) => {
        stringTehai.push(GetHaiName(hai));
    });
    const res = await fetch(
        ENDPOINT_URL + `api/${ai_id}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ arr: stringTehai }),
        }
    );
    if (res.ok) {
        const data = await res.json();
        sendPoint(room_id, user_name, tehai, data);
        console.log(data);
    } else {
        console.log("error");
    }
};

const saveResult = async (tehai: HaiInfo[], point: string, ai_id: number) => {
    const item = localStorage.getItem(USER_NAME_KEY);
    const tehaiForDB: string[] = [];
    tehai.map((hai) => {
        tehaiForDB.push(String(hai.kind) + String(hai.number));
    });
    const res = await fetch(ENDPOINT_URL + "store", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_name: item,
            score: point,
            arr: tehaiForDB,
            ai: AI_NAMES[ai_id - 1],
        }),
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
    const player_name: string = localStorage.getItem(USER_NAME_KEY) || "NoUser";

    // state定義
    const [yama, setYama] = useState<HaiInfo[]>([]);
    const [playerTehai, setPlayerTehai] = useState<HaiInfo[]>([]);
    const [isMyTurn, setIsMyTurn] = useState<boolean>(false);
    const [agariUsers, setAgariUsers] = useState<boolean[]>([false, false, false, false]);
    const [kawas, setKawas] = useState<HaiInfo[][]>([[], [], [], []]);
    const [aiId, setAiId] = useState<number>(0);
    const [points, setPoints] = useState<string[] | null>(null);

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
        if (agariUsers[users.indexOf(player_name)]) {
            sendDiscardHai(room_id, player_name, data.hai);
            return;
        }
        setPlayerTehai([...playerTehai, StringToHai(data.hai)]);
        setIsMyTurn(true);
    }

    const catchDiscardHai = new WebSocket(WS_URL+"?????");
    catchDiscardHai.onmessage = function(event) {
        const data = event.data;
        const newKawas = kawas;
        const user_ind = users.indexOf(data.user_name);
        newKawas[user_ind].push(StringToHai(data.hai));
        setKawas(newKawas);
        if (isGM) {
            sendTumoHai(room_id, users[(user_ind+1)%4], popYama());
        }
    }

    const catchAgariUser = new WebSocket(WS_URL+"?????");
    catchAgariUser.onmessage = function(event) {
        const data = event.data;
        const newAgariUsers = agariUsers;
        newAgariUsers[users.indexOf(data.user_name)] = true;
        setAgariUsers(newAgariUsers);
    }

    const catchResult = new WebSocket(WS_URL+"??????");
    catchResult.onmessage = function(event) {
        const data = event.data;
        const newPoints = ["", "", "", ""];
        data.result.map((r: {user_name: string, point: string}) => {
            newPoints[users.indexOf(r.user_name)] = r.point;
        });
        setPoints(newPoints);
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
                sendDiscardHai(room_id, player_name, targetHai);
                setIsMyTurn(false);
				return true;
			}
		}
		return false;
	};

    const agari = () => {
        sendAgariUser(room_id, player_name);

    }

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