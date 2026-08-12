const { useState } = React
const { Link } = ReactRouterDOM

import { mailService } from '../services/mail.service.js'

const loggedinUser = mailService.getLoggedinUser()

export function MailPreview({ mail, onDelete }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const timestamp = mail.sentAt || mail.createdAt
    const correspondent = mail.from === loggedinUser.email
        ? `To: ${mail.to}`
        : mail.from
    const subject = mail.subject || '(No subject)'
    const bodySnippet = (mail.body && mail.body.trim()) || 'No message body'
    const formattedDate = formatMailDate(timestamp)
    const deleteLabel = mail.removedAt ? 'Delete forever' : 'Move to Trash'

    async function onRemoveMail() {
        if (isDeleting) return

        setIsDeleting(true)
        try {
            await onDelete(mail)
        } catch (err) {
            setIsDeleting(false)
        }
    }

    return (
        <li className={`mail-row ${mail.isRead ? 'read' : 'unread'}`}>
            <Link
                className="mail-row-link"
                to={`/mail/${mail.id}`}
                aria-label={`${mail.isRead ? '' : 'Unread: '}${correspondent}, ${subject}, ${bodySnippet}, ${formattedDate}`}
            >
                <span className="mail-correspondent">{correspondent}</span>

                <span className="mail-summary">
                    <span className="mail-subject">{subject}</span>
                    <span className="mail-summary-separator" aria-hidden="true">—</span>
                    <span className="mail-snippet">{bodySnippet}</span>
                </span>

                {timestamp && (
                    <time
                        className="mail-row-time"
                        dateTime={new Date(timestamp).toISOString()}
                    >
                        {formattedDate}
                    </time>
                )}
            </Link>

            <button
                className="mail-row-delete"
                type="button"
                aria-label={`${deleteLabel}: ${subject}`}
                title={deleteLabel}
                disabled={isDeleting}
                onClick={onRemoveMail}
            >
                <i className="fa-regular fa-trash-can" aria-hidden="true" />
            </button>
        </li>
    )
}

function formatMailDate(timestamp) {
    if (!timestamp) return ''

    const mailDate = new Date(timestamp)
    const today = new Date()
    const isToday = mailDate.getFullYear() === today.getFullYear() &&
        mailDate.getMonth() === today.getMonth() &&
        mailDate.getDate() === today.getDate()

    if (isToday) {
        return new Intl.DateTimeFormat(undefined, {
            hour: 'numeric',
            minute: '2-digit',
        }).format(mailDate)
    }

    if (mailDate.getFullYear() === today.getFullYear()) {
        return new Intl.DateTimeFormat(undefined, {
            month: 'short',
            day: 'numeric',
        }).format(mailDate)
    }

    return new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(mailDate)
}
