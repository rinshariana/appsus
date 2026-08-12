import { noteService } from '../services/note.service.js'
import { NoteEditor } from './NoteEditor.jsx'

export function NoteAdd({ onAddNote }) {
    return (
        <section className="note-add">
            <NoteEditor
                initialNote={noteService.getEmptyNote()}
                onSave={onAddNote}
            />
        </section>
    )
}
