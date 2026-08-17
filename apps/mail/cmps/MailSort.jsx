export function MailSort({ sortBy, onSetSort }) {
    const isAscending = sortBy.direction === 1
    const directionLabel = sortBy.field === 'subject'
        ? isAscending ? 'A to Z' : 'Z to A'
        : isAscending ? 'Oldest first' : 'Newest first'
    const nextDirectionLabel = sortBy.field === 'subject'
        ? isAscending ? 'Z to A' : 'A to Z'
        : isAscending ? 'Newest first' : 'Oldest first'

    return (
        <section className="mail-sort" aria-label="Sort mail">
            <label>
                <span className="mail-visually-hidden">Sort by</span>
                <select
                    value={sortBy.field}
                    onChange={({ target }) => onSetSort({ field: target.value })}
                >
                    <option value="sentAt">Date</option>
                    <option value="subject">Subject</option>
                </select>
                <i className="fa-solid fa-chevron-down" aria-hidden="true" />
            </label>

            <button
                type="button"
                aria-label={`Change sort order to ${nextDirectionLabel}`}
                title={`Change sort order to ${nextDirectionLabel}`}
                onClick={() => onSetSort({ direction: isAscending ? -1 : 1 })}
            >
                <i
                    className={`fa-solid ${isAscending ? 'fa-arrow-up-wide-short' : 'fa-arrow-down-wide-short'}`}
                    aria-hidden="true"
                />
                <span>{directionLabel}</span>
            </button>
        </section>
    )
}
