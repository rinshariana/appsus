import { NotePreview } from "./NotePreview.jsx"

export function NoteList({ notes, onRemoveNote }) {
    const pinnedNotes = notes.filter(note => note.isPinned)
    const otherNotes = notes.filter(note => !note.isPinned)

    return (
        <section className="notes-container">
            <NoteGroup
                title="Pinned"
                groupType="pinned"
                notes={pinnedNotes} 
                onRemoveNote={onRemoveNote}
            />
            <NoteGroup
                title="Others"
                groupType="others" 
                notes={otherNotes} 
                onRemoveNote={onRemoveNote}
            />
        </section>
    )
}

function NoteGroup({ title, groupType, notes, onRemoveNote }) {
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
                        />
                    </li>
                ))}
            </ul>
        </section>
    )
}