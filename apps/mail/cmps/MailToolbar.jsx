export function MailToolbar({
    folderTitle,
    messageCount,
    isLoading,
    isMenuOpen,
    onOpenMenu,
}) {
    const messageCountLabel = `${messageCount} ${messageCount === 1 ? 'message' : 'messages'}`

    return (
        <header className="mail-toolbar">
            <button
                className="mail-menu-btn"
                type="button"
                aria-label="Open mail folders"
                aria-expanded={isMenuOpen}
                aria-controls="mail-folder-drawer"
                onClick={onOpenMenu}
            >
                ☰
            </button>
            <h1>{folderTitle}</h1>
            <span className="mail-count">
                {isLoading ? 'Loading…' : messageCountLabel}
            </span>
        </header>
    )
}
