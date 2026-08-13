import { DynamicCmp } from './DynamicCmp.jsx'

export function NotePreview({ note, onRemoveNote }) {
    return (
        <article 
            className="note note--preview" 
            style={note.style}
            >
                <DynamicCmp
                    cmpType={note.type}
                    info={note.info}
                    isEditMode={false}
                />
                <button
                    className='note-remove-btn'
                    onClick={() => onRemoveNote(note.id)}
                >
                    Delete
                </button>
        </article>
    )
}

