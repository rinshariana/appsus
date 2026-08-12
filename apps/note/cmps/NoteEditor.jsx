const { useState } = React

import { DynamicCmp } from './DynamicCmp.jsx'

export function NoteEditor({ initialNote, onSave }) {
    const [note, setNote] = useState(initialNote)

    function onChangeInfo({ target }) {
        const { name, value } = target

        setNote(prevNote => ({
            ...prevNote,
            info: {
                ...prevNote.info,
                [name]: value
            }
        }))
    }

    function onSubmit(ev) {
        ev.preventDefault()
        onSave(note)
    }

    return (
        <form className="note-editor" onSubmit={onSubmit}>
            <DynamicCmp
                cmpType={note.type}
                info={note.info}
                isEditMode={true}
                onChangeInfo={onChangeInfo}
            />

            <button>Save</button>
        </form>
    )
}