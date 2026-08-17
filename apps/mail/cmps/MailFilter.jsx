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
        <section className="mail-filter" role="search">
            <div className="mail-search-field">
                <label className="mail-visually-hidden" htmlFor="mail-search-input">
                    Search mail
                </label>
                <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
                <input
                    id="mail-search-input"
                    type="search"
                    value={filterBy.txt}
                    placeholder="Search mail"
                    onChange={({ target }) => onSetFilter({ txt: target.value })}
                />
                {filterBy.txt && (
                    <button
                        type="button"
                        aria-label="Clear search"
                        title="Clear search"
                        onClick={() => onSetFilter({ txt: '' })}
                    >
                        <i className="fa-solid fa-xmark" aria-hidden="true" />
                    </button>
                )}
            </div>

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
