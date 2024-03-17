import type { HaiInfo } from "../../types/HaiInfo";

interface Props {
  hai: HaiInfo;
  discardMethod: (hai:HaiInfo) => void
}

const HaiInPlayerTehai: React.VFC<Props> = ({ hai, discardMethod }) => {
    const imgSrc = "../../../public/hai-img/hai" + hai.kind + "_" + hai.number + ".png";
    return (
      <>
        <img src={imgSrc} className="w-12" onClick={() => discardMethod(hai)}/>
      </>
    )
  }
  
export default HaiInPlayerTehai;