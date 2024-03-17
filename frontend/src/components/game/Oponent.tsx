import type { HaiInfo } from "../../types/HaiInfo";
import Kawa from "./Kawa";
import OponentTehai from "./OponentTehai";

interface Props {
    tehai: HaiInfo[];
    kawa: HaiInfo[];
}

const Oponent: React.VFC<Props> = ({ tehai, kawa}) => {
    return (
        <div className="m-4">
            <Kawa kawa={kawa}/>
            <OponentTehai tehai={tehai}/>
        </div>
    )
};

export default Oponent;