const MAIL_FOLDERS = [
    { status: 'inbox', label: 'Inbox', icon: 'fa-solid fa-inbox' },
    { status: 'starred', label: 'Starred', icon: 'fa-regular fa-star' },
    { status: 'sent', label: 'Sent', icon: 'fa-regular fa-paper-plane' },
    { status: 'trash', label: 'Trash', icon: 'fa-regular fa-trash-can' },
]

export function MailFolderList({
    status,
    unreadCount,
    isOpen,
    onSelectFolder,
    onClose,
    onCompose,
    composeButtonRef,
    closeButtonRef,
    isMobile,
}) {
    return (
        <React.Fragment>
            <button
                className={`mail-drawer-backdrop ${isOpen ? 'open' : ''}`}
                type="button"
                aria-label="Close mail folders"
                tabIndex="-1"
                onClick={onClose}
            />

            <aside
                id="mail-folder-drawer"
                className={`mail-folder-list ${isOpen ? 'open' : ''}`}
                role={isMobile ? 'dialog' : undefined}
                aria-label={isMobile ? 'Mail folders' : undefined}
                aria-modal={isMobile ? 'true' : undefined}
                aria-hidden={isMobile ? !isOpen : undefined}
            >
                <button
                    ref={closeButtonRef}
                    className="mail-drawer-close"
                    type="button"
                    aria-label="Close mail folders"
                    autoFocus={isMobile && isOpen}
                    onClick={onClose}
                >
                    <i className="fa-solid fa-xmark" aria-hidden="true" />
                </button>

                <button
                    ref={composeButtonRef}
                    className="mail-compose-btn"
                    type="button"
                    onClick={onCompose}
                >
                    <i className="fa-solid fa-plus" aria-hidden="true" />
                    <span>Compose</span>
                </button>

                <nav aria-label="Mail folders">
                    {MAIL_FOLDERS.map(folder => {
                        const isActive = folder.status === status

                        return (
                            <button
                                className={`mail-folder-btn ${isActive ? 'active' : ''}`}
                                type="button"
                                key={folder.status}
                                aria-current={isActive ? 'page' : undefined}
                                onClick={() => onSelectFolder(folder.status)}
                            >
                                <span className="mail-folder-label">
                                    <i className={folder.icon} aria-hidden="true" />
                                    <span>{folder.label}</span>
                                </span>
                                {folder.status === 'inbox' && unreadCount > 0 && (
                                    <span className="mail-unread-badge" aria-label={`${unreadCount} unread`}>
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </nav>
            </aside>
        </React.Fragment>
    )
}
