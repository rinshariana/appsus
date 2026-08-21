const { Link } = ReactRouterDOM

export function Home() {
    return (
        <main className="home">
            <section className="home-hero" aria-labelledby="home-title">
                <p className="home-eyebrow">
                    <span aria-hidden="true">✦</span>
                    Your workspace, simplified
                </p>
                <h1 id="home-title">
                    Two essentials.
                    <span>One calm place.</span>
                </h1>
                <p className="home-intro">
                    Move between messages and ideas without losing your flow.
                </p>
            </section>

            <section className="app-launchers" aria-label="Apps">
                <Link className="app-launcher app-launcher-mail" to="/mail">
                    <span className="app-launcher-icon">
                        <img
                            src="assets/images/Gmail_icon_(2026).svg.webp"
                            alt=""
                            aria-hidden="true"
                        />
                    </span>
                    <span className="app-launcher-copy">
                        <span className="app-launcher-title">Mail</span>
                        <span className="app-launcher-description">
                            Keep conversations clear and close at hand.
                        </span>
                    </span>
                </Link>

                <Link className="app-launcher app-launcher-note" to="/note">
                    <span className="app-launcher-icon">
                        <i className="fa-regular fa-note-sticky" aria-hidden="true" />
                    </span>
                    <span className="app-launcher-copy">
                        <span className="app-launcher-title">Notes</span>
                        <span className="app-launcher-description">
                            Capture thoughts before they slip away.
                        </span>
                    </span>
                </Link>
            </section>
        </main>
    )
}
