const { Link } = ReactRouterDOM

import { AppNav } from '../../../cmps/AppNav.jsx'

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
                    <img
                        className="mail-brand-mark"
                        src="assets/images/Gmail_icon_(2026).svg.webp"
                        alt=""
                        aria-hidden="true"
                    />
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

            <AppNav />
        </header>
    )
}
