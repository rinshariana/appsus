const { Link } = ReactRouterDOM

export function MailHeader({
    filterBy,
    onSetFilter,
    isSidebarCollapsed,
    isFolderDrawerOpen,
    isMobile,
    onToggleNavigation,
    menuButtonRef,
}) {
    const isNavigationExpanded = isMobile
        ? isFolderDrawerOpen
        : !isSidebarCollapsed

    return (
        <header className="mail-header">
            <section className="mail-header-branding">
                <button
                    ref={menuButtonRef}
                    className="mail-header-icon-btn mail-navigation-toggle"
                    type="button"
                    aria-label={isMobile
                        ? 'Open mail folders'
                        : isSidebarCollapsed ? 'Expand mail folders' : 'Collapse mail folders'
                    }
                    aria-expanded={isNavigationExpanded}
                    aria-controls="mail-folder-drawer"
                    onClick={onToggleNavigation}
                >
                    <i className="fa-solid fa-bars" aria-hidden="true" />
                </button>

                <Link className="mail-brand" to="/" aria-label="MisterMail home">
                    <svg className="mail-brand-mark" viewBox="0 0 42 32" aria-hidden="true">
                        <path d="M3 7v21h7V13.4L21 22l11-8.6V28h7V7L21 20z" fill="#4285f4" />
                        <path d="M3 7 21 20l4.2-3.3L8.7 4.4A3.5 3.5 0 0 0 3 7Z" fill="#ea4335" />
                        <path d="m39 7-18 13-4.2-3.3L33.3 4.4A3.5 3.5 0 0 1 39 7Z" fill="#fbbc04" />
                        <path d="M3 7v21h7V12.2Z" fill="#c5221f" />
                        <path d="M39 7v21h-7V12.2Z" fill="#34a853" />
                    </svg>
                    <span>MisterMail</span>
                </Link>
            </section>

            <section className="mail-header-search" role="search">
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
            </section>

            <nav className="mail-header-apps" aria-label="Appsus applications">
                <Link to="/" aria-label="Appsus home" title="Appsus home">
                    <i className="fa-solid fa-grip" aria-hidden="true" />
                </Link>
                <Link to="/note" aria-label="Notes" title="Notes">
                    <i className="fa-regular fa-note-sticky" aria-hidden="true" />
                </Link>
            </nav>
        </header>
    )
}
