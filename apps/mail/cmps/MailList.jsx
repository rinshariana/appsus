import { MailPreview } from './MailPreview.jsx'

export function MailList({ mails, isLoading, onDeleteMail }) {
    if (isLoading) {
        return <p className="mail-list-status" role="status">Loading mail…</p>
    }

    if (!mails.length) {
        return <p className="mail-list-status">This folder is empty.</p>
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
