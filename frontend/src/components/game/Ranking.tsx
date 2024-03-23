import { ENDPOINT_URL, UNDEFINED_RESULT_DATA } from "./Constants";
import { useEffect, useState } from "react";
import Hai from "./Hai";
import { HaiInfo } from "../../types/HaiInfo";
import type { ResultData } from "../../types/ResultData";

type rankingDatas = {
    high: ResultData[];
    low: ResultData[];
}

const defaultRankingDatas: rankingDatas = {
    high: [UNDEFINED_RESULT_DATA],
    low: [UNDEFINED_RESULT_DATA],
}

const Ranking = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [rankingDatas, SetRankingData] = useState<rankingDatas>(defaultRankingDatas);
    const getRanking = async () => {
        setIsLoading(true);
        const res = await fetch(
            ENDPOINT_URL + "ranking",
            {
                method: "GET",
            }
        );
        if (res.ok) {
            const data: rankingDatas = await res.json();
            SetRankingData(data);
            console.log(data);
            setIsLoading(false);
        } else {
            console.log("error")
        }
    };
    
    useEffect(() => {
        getRanking();
    }, []);
    return (
        <>
            {isLoading ? (
                <p>ロード中</p>
            ) : (
                <>
                { rankingDatas.high.map((rankingData) => {
                    return <div key={rankingData.id}>
                        <p>{rankingData.user_name}</p>
                        <p>{rankingData.score}</p>
                        <p>{rankingData.ai}</p>
                        <div>{ rankingData.hand.split(',').map((hand, index) => {
                            const haiInfo: HaiInfo = {kind: Number(hand[0]), number: Number(hand[1])}
                            return <Hai hai={haiInfo} key={index} />
                        }) }
                        </div>
                    </div>
                    }) }
                </>
            )}
        </>
    )
}

export default Ranking