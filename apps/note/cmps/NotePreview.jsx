import { DynamicCmp } from './DynamicCmp.jsx'

export function NotePreview({ note, onRemoveNote, onEditNote, onTogglePin }) {
    return (
        <article 
            className="note note--preview" 
            style={note.style}
            onClick={() => onEditNote(note)}
            >
                <DynamicCmp
                    cmpType={note.type}
                    info={note.info}
                    isEditMode={false}
                />
                <button
                    className='note-remove-btn'
                    onClick={(ev) => {
                        ev.stopPropagation()
                        onRemoveNote(note.id)
                    }}
                >
                    Delete
                </button>
                <button className='note-pin-btn'
                onClick={(ev) => {
                    ev.stopPropagation()
                    onTogglePin(note)
                }}
                >
                    {note.isPinned? 'Unpin' : 'Pin'}
                </button>
        </article>
    )
}

