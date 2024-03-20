import type { HaiInfo } from "../../types/HaiInfo";
import Hai from "./Hai";

interface Props {
    tehai : HaiInfo[]
}

const OponentTehai : React.VFC<Props> = ({tehai}) => {
    return (
        <div className="flex">
            {
                tehai.map((hai, index) => (
                    <Hai hai={hai} key={index} />
                ))
            }
        </div>
    )
}

export default OponentTehai;