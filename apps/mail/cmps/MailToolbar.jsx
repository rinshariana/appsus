import { MailFilter } from './MailFilter.jsx'
import { MailSort } from './MailSort.jsx'

export function MailToolbar({
    folderTitle,
    messageCount,
    isLoading,
    isMenuOpen,
    filterBy,
    sortBy,
    onOpenMenu,
    onSetFilter,
    onSetSort,
    menuButtonRef,
}) {
    const messageCountLabel = `${messageCount} ${messageCount === 1 ? 'message' : 'messages'}`

    return (
        <header className="mail-toolbar">
            <button
                ref={menuButtonRef}
                className="mail-menu-btn"
                type="button"
                aria-label="Open mail folders"
                aria-expanded={isMenuOpen}
                aria-controls="mail-folder-drawer"
                onClick={onOpenMenu}
            >
                <i className="fa-solid fa-bars" aria-hidden="true" />
            </button>

            <section className="mail-toolbar-heading">
                <h1 tabIndex="-1">{folderTitle}</h1>
                <span className="mail-count">
                    {isLoading ? 'Loading…' : messageCountLabel}
                </span>
            </section>

            <section className="mail-toolbar-controls" aria-label="Mail list controls">
                <MailFilter
                    filterBy={filterBy}
                    onSetFilter={onSetFilter}
                />
                <MailSort
                    sortBy={sortBy}
                    onSetSort={onSetSort}
                />
            </section>
        </header>
    )
}
