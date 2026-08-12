import { NotePreview } from "./NotePreview.jsx"

export function NoteList({ notes }) {
    const pinnedNotes = notes.filter(note => note.isPinned)
    const otherNotes = notes.filter(note => !note.isPinned)

    return (
        <section className="notes-container">
            <NoteGroup title="Pinned" notes={pinnedNotes} />
            <NoteGroup title="Others" notes={otherNotes} />
        </section>
    )
}

function NoteGroup({ title, notes }) {
    if (!notes.length) return null

    return (
        <section className="note-group">
            <h2>{title}</h2>

            <ul className="note-list">
                {notes.map(note => (
                    <li key={note.id}>
                        <NotePreview note={note} />
                    </li>
                ))}
            </ul>
        </section>
    )
}