import type { HaiInfo } from "../../types/HaiInfo";
import Hai from "./Hai";

interface Props {
    kawa : HaiInfo[];
}

const Kawa : React.VFC<Props> = ({kawa}) => {
    return (
        <div className="flex">
            {
                kawa.map((hai, index) => {
                    return <Hai hai={hai} key={index} />
                })
            }
        </div>
    )
}

export default Kawa;