import { noteService } from '../services/note.service.js'
import { NoteList } from '../cmps/NoteList.jsx'
import { NoteAdd } from '../cmps/NoteAdd.jsx'
import { NoteEditor } from '../cmps/NoteEditor.jsx'

const { useState, useEffect } = React

export function NoteIndex() {
    const [notes, setNotes] = useState(null)
    const [selectedNote, setSelectedNote] = useState(null)

    useEffect(() => {
        loadNotes()
    }, [])

    function loadNotes() {
        return noteService.query()
            .then(setNotes)
    }

    function onAddNote(note) {
        return noteService.save(note)
            .then(savedNote => {
                setNotes(prevNotes => [savedNote, ...prevNotes])
            })
    }

    function onRemoveNote(noteId) {
        noteService.remove(noteId)
            .then(() => {
                setNotes(prevNotes =>
                    prevNotes.filter(note => note.id !== noteId)
                )
            })
    }

    function onEditNote(note) {
        setSelectedNote(note)
    }

    function onSaveEditedNote(note) {
        return noteService.save(note)
            .then(() => loadNotes())
            .then(() => setSelectedNote(null))
    }

    function onTogglePin(note) {
        const updatedNote = {
            ...note,
            isPinned: !note.isPinned
        }

        return noteService.save(updatedNote)
            .then(() => loadNotes())
    }


    if (!notes) return <div>Loading...</div>

    return (
        <section className="note-index">
            <h2>Keep</h2>
            <NoteAdd onAddNote={onAddNote} />
            {selectedNote && (
                <NoteEditor
                    initialNote={selectedNote}
                    onSave={onSaveEditedNote}
                />
            )
            }
            <NoteList
                notes={notes}
                onRemoveNote={onRemoveNote}
                onEditNote={onEditNote}
                onTogglePin={onTogglePin}
            />
        </section>
    )
}
