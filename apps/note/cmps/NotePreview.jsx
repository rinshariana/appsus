import { NoteTxt } from "./NoteTxt.jsx"

export function NotePreview({ note }) {
    return (
        <article
            className="note-preview"
            style={note.style}
        >
            {note.type === 'NoteTxt' && <NoteTxt info={note.info}/>}
        </article>
    )
}

