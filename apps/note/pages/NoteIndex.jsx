import { noteService } from '../services/note.service.js'
import { NoteList } from '../cmps/NoteList.jsx'

const { useState, useEffect } = React

export function NoteIndex() {
    const [notes, setNotes] = useState(null)

    useEffect(() => {
        loadNotes()
    }, [])

    function loadNotes() {
        noteService.query()
            .then(setNotes)
    }

    if (!notes) return <div>Loading...</div>

    return (
        <section className="note-index">
            <h2>Keep</h2>
            <NoteList notes={notes} />
        </section>
    )
}
