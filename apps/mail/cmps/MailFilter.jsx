export function MailFilter({ filterBy, onSetFilter }) {
    const readState = filterBy.isRead === null
        ? 'all'
        : filterBy.isRead ? 'read' : 'unread'

    function onChangeReadState({ target }) {
        const valueMap = {
            all: null,
            read: true,
            unread: false,
        }

        onSetFilter({ isRead: valueMap[target.value] })
    }

    return (
        <section className="mail-filter" aria-label="Filter mail">
            <label className="mail-read-filter">
                <span className="mail-visually-hidden">Filter by read state</span>
                <select value={readState} onChange={onChangeReadState}>
                    <option value="all">All mail</option>
                    <option value="read">Read</option>
                    <option value="unread">Unread</option>
                </select>
                <i className="fa-solid fa-chevron-down" aria-hidden="true" />
            </label>
        </section>
    )
}
