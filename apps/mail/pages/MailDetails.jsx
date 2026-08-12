const { Link, useParams } = ReactRouterDOM

export function MailDetails() {
    const { mailId } = useParams()

    return (
        <section className="mail-details">
            <Link className="mail-details-back" to="/mail">
                ← Back to mail
            </Link>
            <h2>Mail details</h2>
            <p>Current mail ID: <strong>{mailId}</strong></p>
        </section>
    )
}
