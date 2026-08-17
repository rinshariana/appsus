export function NoteHeader({ isScrolled, onToggleSidebar }) {
    return (
        <header
            className={`note-header full main-layout ${isScrolled ? 'scrolled' : ''}`}
        >
            <section className="note-header-container">
                <button
                    className="note-menu-btn"
                    onClick={onToggleSidebar}
                >
                    ☰
                </button>

                <div className="note-brand">
                    <span className="note-logo">💡</span>
                    <h1>Keep</h1>
                </div>

                <div className="note-search">
                    Search
                </div>
            </section>
        </header>
    )
}