export function NoteFilter({ filterBy, onSetFilter }) {

    function handleChange({ target }) {
        const { name, value } = target

        onSetFilter({
            ...filterBy,
            [name]: value
        })
    }

    function onClearSearch() {
        onSetFilter({
            ...filterBy,
            txt: ''
        })
    }

    return (
        <section className="note-filter">
            <svg
                className="note-filter-search-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path d="M9.5 3a6.5 6.5 0 1 0 3.98 11.64L19.85 21 21 19.85l-6.36-6.37A6.5 6.5 0 0 0 9.5 3zm0 2a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9z" />
            </svg>

            <input
                type="search"
                name="txt"
                value={filterBy.txt}
                onChange={handleChange}
                placeholder="Search"
            />

            {/* {filterBy.txt && (
                <button
                    className="note-filter-clear-btn"
                    onClick={onClearSearch}
                    aria-label="Clear search"
                    type="button"
                >
                    ×
                </button>
            )} */}
        </section>
    )
}
