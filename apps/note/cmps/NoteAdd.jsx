const { useState } = React

import { noteService } from '../services/note.service.js'
import { NoteForm } from './NoteForm.jsx'

export function NoteAdd({ onAddNote }) {
    const [note, setNote] = useState(noteService.getEmptyNote())

    function onSaveNote(ev) {
        ev.preventDefault()
        onAddNote(note)
    }

    return (
        <form className="note-add" onSubmit={onSaveNote}>
            <NoteForm
                note={note}
                setNote={setNote}
            />

            <button>Save</button>
        </form>
    )
}