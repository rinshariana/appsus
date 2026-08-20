import { noteService } from '../services/note.service.js'
import { NoteEditor } from './NoteEditor.jsx'

export function NoteAdd({ onAddNote, initialNote = noteService.getEmptyNote() }) {
    return (
        <section className="note-add">
            <NoteEditor
                initialNote={initialNote}
                onSave={onAddNote}
            />
        </section>
    )
}
