const { useOutletContext, useParams } = ReactRouterDOM

export function MailDetails() {
    const { mailId } = useParams()
    const { onCloseDetails } = useOutletContext()

    return (
        <section className="mail-details">
            <button
                className="mail-details-back"
                type="button"
                onClick={onCloseDetails}
            >
                ← Back to mail
            </button>
            <h2>Mail details</h2>
            <p>Current mail ID: <strong>{mailId}</strong></p>
        </section>
    )
}
