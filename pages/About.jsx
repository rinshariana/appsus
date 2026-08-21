export function About() {
    return (
        <main className="about">
            <section className="about-intro" aria-labelledby="about-title">
                <p className="about-eyebrow">About Appsus</p>
                <h1 id="about-title">Simple tools, thoughtfully together.</h1>
                <p>
                    Appsus brings email and notes into one lightweight workspace,
                    so everyday work feels easy to find and quick to finish.
                </p>
            </section>

            <section className="about-products" aria-label="Appsus products">
                <article className="about-product">
                    <span>
                        <strong>Mail</strong>
                        <span>A focused place for everyday conversations.</span>
                    </span>
                </article>

                <article className="about-product">
                    <span>
                        <strong>Notes</strong>
                        <span>A quiet space to collect ideas and reminders.</span>
                    </span>
                </article>
            </section>
        </main>
    )
}
