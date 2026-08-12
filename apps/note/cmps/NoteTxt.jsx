export function NoteTxt({ info, isEditMode, onChangeInfo }) {
    if (isEditMode) {
        return (
            <section className="note note--edit note-txt">
                <input
                    className="note-title"
                    type="text"
                    name="title"
                    value={info.title}
                    onChange={onChangeInfo}
                    placeholder="Title"
                />

                <textarea
                className="note-content"
                    name="txt"
                    value={info.txt}
                    onChange={onChangeInfo}
                    placeholder="Take a note..."
                />
            </section>
        )
    }

    return (
        <section className="note-txt">
            <h3>{info.title}</h3>
            <p>{info.txt}</p>
        </section>
    )
}