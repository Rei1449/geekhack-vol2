import { Button } from "../ui/button"

interface Props {
    onClickMethod : () => void
}

const AgariButton : React.VFC<Props> = ({onClickMethod}) => {
    return (
        <Button onClick={onClickMethod}>あがり</Button>
    )
}

export default AgariButton