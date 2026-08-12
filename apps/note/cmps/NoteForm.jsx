export function NoteForm({ note, setNote }) {
    function handleChange({ target }) {
        const { name, value } = target

        setNote(prev => ({
            ...prev,
            info: {
                ...prev.info,
                [name]: value
            }
        }))
    }

    return (
         <div className="note-form">
            <input
                type="text"
                name="title"
                value={note.info.title}
                onChange={handleChange}
                placeholder="Title"
            />

            <textarea
                name="txt"
                value={note.info.txt}
                onChange={handleChange}
                placeholder="Take a note..."
            />
        </div>
    )
}