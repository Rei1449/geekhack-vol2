import { useState } from "react";
import type { HaiInfo } from "../../types/HaiInfo";
import { Button } from "../ui/button";
import Hai from "./Hai";

interface Props {
    popYama: () => HaiInfo;
}

const Tehai: React.VFC<Props> = ({ popYama }) => {
    const [tehai, setTehai] = useState<HaiInfo[]>([]);
    const makeTehai = (): void => {
        const newTehai: HaiInfo[] = [];
        for (let i = 0; i < 13; i++) {
            newTehai.push(popYama());
        }
        setTehai(newTehai);
    }
    
    const discard = (): void => {
        setTehai(prevTehai => {
            const newTehai = [...prevTehai];
            newTehai.pop();
            return newTehai;
        });
    }
    
    const tumo = (): void => {
        const tumoHai :HaiInfo = popYama();
        setTehai(prevTehai => [...prevTehai, tumoHai]);
    }
    
    const clickHai = (): void => {
        discard();
        tumo();
        // console.log("click")
    }
    
    return (
        <>
            {
                tehai.map((hai, index) => (
                    <Hai hai={hai} key={index} />
                    ))
            }
            <Button onClick={makeTehai}>start</Button>
            <Button onClick={clickHai}>discard</Button>
        </>
    )
}


export default Tehai;