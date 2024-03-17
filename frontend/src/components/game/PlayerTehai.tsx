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
                tehai.map((hai, index) => {
                    if (index < 13) {
                        return <HaiInPlayerTehai  hai={hai} key={index} discardMethod={() => discardMethod(hai)}/>
                    } else {
                        return (
                            <div className="ml-4" key={index}>
                                <HaiInPlayerTehai  hai={hai} discardMethod={() => discardMethod(hai)}/>
                            </div>
                            )
                    }
                })
            }
        </div>
    )
}

export default PlayerTehai;