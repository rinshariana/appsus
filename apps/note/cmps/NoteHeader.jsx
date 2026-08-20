export function NoteHeader({ isScrolled, onToggleSidebar }) {
    return (
        <header
            className={`note-header full main-layout ${isScrolled ? 'scrolled' : ''}`}
        >
            <section className="note-header-container">
                <button
                    className="note-menu-btn"
                    onClick={onToggleSidebar}
                    aria-label="Main menu"
                >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                    </svg>
                </button>

                <a
                    className="note-brand"
                    aria-label="Keep"
                    href="#/note"
                >
                    <img
                        className="note-brand-logo"
                        src="https://www.gstatic.com/images/branding/productlogos/keep_2026/v2/web-48dp/logo_keep_2026_color_1x_web_48dp.png"
                        srcSet="
            https://www.gstatic.com/images/branding/productlogos/keep_2026/v2/web-48dp/logo_keep_2026_color_1x_web_48dp.png 1x,
            https://www.gstatic.com/images/branding/productlogos/keep_2026/v2/web-48dp/logo_keep_2026_color_2x_web_48dp.png 2x
        "
                        alt=""
                        aria-hidden="true"
                        role="presentation"
                    />

                    <span className="note-brand-title">Keep</span>
                </a>

                <div className="note-search">
                    Search
                </div>

            </section>
        </header>
    )
}