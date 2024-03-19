import '../../index.css'
import type { HaiInfo } from '../../types/HaiInfo.tsx'
import { useState } from 'react'
import Player from './Player.tsx'
import Oponent from './Oponent.tsx'
import AgariButton from './AgariButton.tsx'
import { GetHaiName, ShuffleArray, IsSameHai, SortHaiArray } from './CommonMethods.tsx'
import { UNDEFINED_HAI } from './Constants.tsx'

const makeYama = (): HaiInfo[] => {
    const yama: HaiInfo[] = [];
    // 数牌
    for (let kind = 1; kind <= 3; kind++) {
        for (let number = 1; number <= 9; number++) {
            for (let i=0; i<4; i++) {
                yama.push({kind: kind, number: number});
            }
        }
    }
    // 字牌
    for (let number = 1; number <= 7; number++) {
        for (let i=0; i<4; i++) {
            yama.push({kind: 4, number: number});
        }
    }
    return ShuffleArray(yama);
}

const agari = (tehai:HaiInfo[]): void => {
    const stringTehai: string[] = [];
    SortHaiArray(tehai);
    tehai.map((hai) => {
        stringTehai.push(GetHaiName(hai));
    });
    console.log(stringTehai);
}

const Game = () => {
    const [yama, setYama] = useState<HaiInfo[]>([]);
    const popYama = () : HaiInfo => {
        const lastHai : HaiInfo | undefined = yama.pop();
        const newYama = [...yama];
        setYama(newYama);
        // console.log("popYama")
        return lastHai || {kind: -1, number: -1};
    }
    const [playerTehai, setPlayerTehai] = useState<HaiInfo[]>([]);
    const [oponent1Tehai, setopOponent1Tehai] = useState<HaiInfo[]>([]);
    const [oponent2Tehai, setopOponent2Tehai] = useState<HaiInfo[]>([]);
    const [oponent3Tehai, setopOponent3Tehai] = useState<HaiInfo[]>([]);
    const [playerKawa, setPlayerKawa] = useState<HaiInfo[]>([]);
    const [oponent1Kawa, setOponent1Kawa] = useState<HaiInfo[]>([]);
    const [oponent2Kawa, setOponent2Kawa] = useState<HaiInfo[]>([]);
    const [oponent3Kawa, setOponent3Kawa] = useState<HaiInfo[]>([]);

    const tumo = () : void => {
        setPlayerTehai([...playerTehai, popYama()]);
    }

    const discard = (targetHai: HaiInfo) : boolean => {
        const newPlayerTehai = playerTehai;
        for (let i=0; i<playerTehai.length; i++) {
            if (IsSameHai(targetHai, playerTehai[i])) {
                newPlayerTehai.splice(i, 1);
                SortHaiArray(newPlayerTehai);
                setPlayerTehai(newPlayerTehai);
                setPlayerKawa([...playerKawa, targetHai]);
                return true;
            }
        }
        return false;
    }

    const progressTurn = (discardHai: HaiInfo) : void => {
        discard(discardHai);
        // cpuはつもぎり
        setOponent1Kawa([...oponent1Kawa, popYama()]);
        setOponent2Kawa([...oponent2Kawa, popYama()]);
        setOponent3Kawa([...oponent3Kawa, popYama()]);
        if (yama.length == 0) {
            window.alert("Game End");
        }
        tumo();
    }

    const startGame = () : void => {
        const newYama = makeYama();
        const newPlayerTehai : HaiInfo[] = [];
        const newOponent1Tehai : HaiInfo[] = [];
        const newOponent2Tehai : HaiInfo[] = [];
        const newOponent3Tehai : HaiInfo[] = [];
        // 配牌
        for (let i = 0; i < 13; i++) {
            newPlayerTehai.push(newYama.pop() || UNDEFINED_HAI);
            newOponent1Tehai.push(newYama.pop() || UNDEFINED_HAI);
            newOponent2Tehai.push(newYama.pop() || UNDEFINED_HAI);
            newOponent3Tehai.push(newYama.pop() || UNDEFINED_HAI);
        }
        SortHaiArray(newPlayerTehai);
        newPlayerTehai.push(newYama.pop() || UNDEFINED_HAI);
        setYama(newYama);
        setPlayerTehai(newPlayerTehai);
        setopOponent1Tehai(newOponent1Tehai);
        setopOponent2Tehai(newOponent2Tehai);
        setopOponent3Tehai(newOponent3Tehai);
    }

    return (
        <>
            <button onClick={startGame} >Game Start</button>
            <Player tehai={playerTehai} kawa={playerKawa} discardMethod={progressTurn}/>
            <Oponent tehai={oponent1Tehai} kawa={oponent1Kawa}/>
            <Oponent tehai={oponent2Tehai} kawa={oponent2Kawa}/>
            <Oponent tehai={oponent3Tehai} kawa={oponent3Kawa}/>
            <AgariButton onClickMethod={() => agari(playerTehai)}/>
            <p>yama.length: {yama.length}</p>
        </>
    )
}

export default Game;