import { NotePreview } from "./NotePreview.jsx"

export function NoteList({ notes, onRemoveNote }) {
    const pinnedNotes = notes.filter(note => note.isPinned)
    const otherNotes = notes.filter(note => !note.isPinned)

    return (
        <section className="notes-container">
            <NoteGroup
                title="Pinned" 
                notes={pinnedNotes} 
                onRemoveNote={onRemoveNote}
            />
            <NoteGroup
                title="Others" 
                notes={otherNotes} 
                onRemoveNote={onRemoveNote}
            />
        </section>
    )
}

function NoteGroup({ title, notes, onRemoveNote }) {
    if (!notes.length) return null

    return (
        <section className="note-group">
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