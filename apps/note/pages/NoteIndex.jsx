import { noteService } from '../services/note.service.js'
import { NoteList } from '../cmps/NoteList.jsx'
import { NoteAdd } from '../cmps/NoteAdd.jsx'
import { NoteEditor } from '../cmps/NoteEditor.jsx'
import { showErrorMsg, showSuccessMsg } from '../../../services/event-bus.service.js'
import { NoteHeader } from '../cmps/NoteHeader.jsx'

const { useState, useEffect } = React

export function NoteIndex() {
    const [notes, setNotes] = useState(null)
    const [selectedNote, setSelectedNote] = useState(null)
    const [isScrolled, setIsScrolled] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    useEffect(() => {
        loadNotes()
    }, [])

    function onToggleSidebar() {
        setIsSidebarOpen(prev => !prev)
    }



    function loadNotes() {
        return noteService.query()
            .then(setNotes)
    }

    function onAddNote(note) {
        return noteService.save(note)
            .then(savedNote => {
                setNotes(prevNotes => [savedNote, ...prevNotes])
                showSuccessMsg('Note added')
            })
            .catch(err => showErrorMsg('Cannot add note'))
    }

    function onRemoveNote(noteId) {
        noteService.remove(noteId)
            .then(() => {
                setNotes(prevNotes =>
                    prevNotes.filter(note => note.id !== noteId)
                )
                showSuccessMsg(`note ${noteId} removed`)
            })
            .catch(err => showErrorMsg(`Could not remove ${noteId}`))
    }

    function onEditNote(note) {
        setSelectedNote(note)
    }

    function onSaveEditedNote(note) {
        return noteService.save(note)
            .then(() => {
                showSuccessMsg(`note ${note.id} saved`)
                setSelectedNote(null)
            })
            .then(() => loadNotes())
            .catch(err => showErrorMsg(`Could not save ${note.id}`))
    }

    function onTogglePin(note) {
        const updatedNote = {
            ...note,
            isPinned: !note.isPinned
        }
        const actionTried = updatedNote.isPinned ? 'pin' : 'unpin'

        return noteService.save(updatedNote)
            .then(() => showSuccessMsg(`note ${note.id} ${actionTried}ned`))
            .then(() => loadNotes())
            .catch(err => showErrorMsg(`Could not ${actionTried} ${noteId}`))
    }

    if (!notes) return <div>Loading...</div>

    return (
        <section className="note-index main-layout">
            <NoteHeader
                isScrolled={isScrolled}
                onToggleSidebar={onToggleSidebar}
            />

            <section className="note-page full">
                <aside className={`note-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                    <button>💡</button>
                </aside>

                <main
                    className="note-main"
                    onScroll={(ev) =>
                        setIsScrolled(ev.currentTarget.scrollTop > 0)
                    }
                >
                    <section className="note-content">
                        <NoteAdd onAddNote={onAddNote} />

                        {selectedNote && (
                            <NoteEditor
                                initialNote={selectedNote}
                                onSave={onSaveEditedNote}
                            />
                        )}

                        <NoteList
                            notes={notes}
                            onRemoveNote={onRemoveNote}
                            onEditNote={onEditNote}
                            onTogglePin={onTogglePin}
                        />
                    </section>
                </main>
            </section>
        </section>
    )
}