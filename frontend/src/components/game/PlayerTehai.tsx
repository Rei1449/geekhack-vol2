import type { HaiInfo } from "../../types/HaiInfo";
import HaiInPlayerTehai from "./HaiInPlayerTehai";

interface Props {
    tehai : HaiInfo[]
    discardMethod: (hai:HaiInfo) => void
}

const PlayerTehai : React.VFC<Props> = ({tehai, discardMethod}) => {
    return (
        <div className="flex">
            {
                tehai.map((hai, index) => (
                    <HaiInPlayerTehai  hai={hai} key={index} discardMethod={() => discardMethod(hai)}/>
                ))
            }
        </div>
    )
}

export default PlayerTehai;