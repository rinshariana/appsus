import { MailPreview } from './MailPreview.jsx'

export function MailList({ mails, isLoading, hasActiveFilters, onDeleteMail }) {
    if (isLoading) {
        return (
            <div className="mail-list mail-list-loading" role="status">
                <span className="mail-visually-hidden">Loading mail…</span>
                {[1, 2, 3, 4, 5, 6, 7].map(rowNum => (
                    <span className="mail-loading-row" aria-hidden="true" key={rowNum}>
                        <span className="mail-loading-bar correspondent" />
                        <span className="mail-loading-bar summary" />
                        <span className="mail-loading-bar date" />
                    </span>
                ))}
            </div>
        )
    }

    if (!mails.length) {
        return (
            <section className="mail-list-status">
                <i className="fa-regular fa-envelope-open" aria-hidden="true" />
                <p>{hasActiveFilters
                    ? 'No messages match your filters.'
                    : 'This folder is empty.'
                }</p>
            </section>
        )
    }

    return (
        <ul className="mail-list">
            {mails.map(mail => (
                <MailPreview
                    mail={mail}
                    onDelete={onDeleteMail}
                    key={mail.id}
                />
            ))}
        </ul>
    )
}
