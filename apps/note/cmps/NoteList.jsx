import { NotePreview } from "./NotePreview.jsx"

export function NoteList({ notes, onRemoveNote, onEditNote, onTogglePin }) {
    const pinnedNotes = notes.filter(note => note.isPinned)
    const otherNotes = notes.filter(note => !note.isPinned)

    return (
        <section className="notes-container">
            <NoteGroup
                title="Pinned"
                groupType="pinned"
                notes={pinnedNotes} 
                onRemoveNote={onRemoveNote}
                onEditNote={onEditNote}
                onTogglePin={onTogglePin}
            />
            <NoteGroup
                title="Others"
                groupType="others" 
                notes={otherNotes} 
                onRemoveNote={onRemoveNote}
                onEditNote={onEditNote}
                onTogglePin={onTogglePin}
            />
        </section>
    )
}

function NoteGroup({ title, groupType, notes, onRemoveNote, onEditNote, onTogglePin }) {
    if (!notes.length) return null

    return (
        <section className={`note-group note-group--${groupType}`}>
            <h2>{title}</h2>

            <ul className="note-list">
                {notes.map(note => (
                    <li key={note.id}>
                        <NotePreview 
                            note={note}
                            onRemoveNote={onRemoveNote}
                            onEditNote={onEditNote}
                            onTogglePin={onTogglePin}
                        />
                    </li>
                ))}
            </ul>
        </section>
    )
}