import { noteService } from '../services/note.service.js'
import { NoteList } from '../cmps/NoteList.jsx'
import { NoteAdd } from '../cmps/NoteAdd.jsx'

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

    function onAddNote(note) {
    noteService.save(note)
        .then(savedNote => {
            setNotes(prevNotes => [savedNote, ...prevNotes])
        })
}

    if (!notes) return <div>Loading...</div>

    return (
        <section className="note-index">
            <h2>Keep</h2>
              <NoteAdd onAddNote={onAddNote} />
            <NoteList notes={notes} />
        </section>
    )
}
