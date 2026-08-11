export function NotePreview({ note }) {
    return (
        <article
            className="note-preview"
            style={note.style}
        >
            <p>{note.type}</p>
            <pre>{JSON.stringify(note.info, null, 2)}</pre>
        </article>
    )
}

