import { NoteTxt } from "./NoteTxt.jsx"

export function NotePreview({ note }) {
    return (
        <article
            className="note-preview"
            style={note.style}
        >
            <DynamicCmp 
            cmpType={note.type}
            info={note.info}
            />
        </article>
    )
}

function DynamicCmp(props) {
    const cmpMap = {
        NoteTxt: <NoteTxt {...props} />,
    }

    return cmpMap[props.cmpType]
}

