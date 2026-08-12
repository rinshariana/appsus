const MAIL_FOLDERS = [
    { status: 'inbox', label: 'Inbox' },
    { status: 'sent', label: 'Sent' },
    { status: 'trash', label: 'Trash' },
]

export function MailFolderList({
    status,
    unreadCount,
    isOpen,
    onSelectFolder,
    onClose,
}) {
    return (
        <React.Fragment>
            <button
                className={`mail-drawer-backdrop ${isOpen ? 'open' : ''}`}
                type="button"
                aria-label="Close mail folders"
                tabIndex={isOpen ? 0 : -1}
                onClick={onClose}
            />

            <aside
                id="mail-folder-drawer"
                className={`mail-folder-list ${isOpen ? 'open' : ''}`}
            >
                <button
                    className="mail-drawer-close"
                    type="button"
                    aria-label="Close mail folders"
                    onClick={onClose}
                >
                    ×
                </button>

                <button
                    className="mail-compose-btn"
                    type="button"
                    disabled
                    aria-describedby="compose-unavailable"
                >
                    Compose
                </button>
                <p id="compose-unavailable" className="mail-compose-help">
                    Compose will be available in a later version.
                </p>

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
                                <span>{folder.label}</span>
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
