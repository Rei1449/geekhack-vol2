import type { HaiInfo } from "../../types/HaiInfo";
import Kawa from "./Kawa";
import OponentTehai from "./OponentTehai";

interface Props {
    tehai: HaiInfo[]
    kawa: HaiInfo[]
    rotate?: number
}

const Oponent: React.VFC<Props> = ({ tehai, kawa, rotate=0}) => {
    return (
        <div className={"m-4 rotate-"+rotate}>
            <Kawa kawa={kawa}/>
            <OponentTehai tehai={tehai}/>
        </div>
    )
};

export default Oponent;