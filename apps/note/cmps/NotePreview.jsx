import { DynamicCmp } from './DynamicCmp.jsx'

export function NotePreview({ note }) {
    return (
        <article className="note note--preview" style={note.style}>
            <DynamicCmp
                cmpType={note.type}
                info={note.info}
                isEditMode={false}
            />
        </article>
    )
}

