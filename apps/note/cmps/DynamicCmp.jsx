import { NoteTxt } from './NoteTxt.jsx'

export function DynamicCmp(props) {
    const cmpMap = {
        NoteTxt: <NoteTxt {...props} />,
    }

    return cmpMap[props.cmpType]
}