const { useState } = React
const { Link } = ReactRouterDOM

import { mailService } from '../services/mail.service.js'
import { MailStarButton } from './MailStarButton.jsx'

const loggedinUser = mailService.getLoggedinUser()

export function MailPreview({ mail, onDelete, onToggleStar }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const timestamp = mail.sentAt || mail.createdAt
    const correspondent = mail.from === loggedinUser.email
        ? `To: ${mail.to}`
        : mail.from
    const subject = mail.subject || '(No subject)'
    const bodySnippet = (mail.body && mail.body.trim()) || 'No message body'
    const formattedDate = formatMailDate(timestamp)
    const deleteLabel = mail.removedAt ? 'Delete forever' : 'Move to Trash'
    const pendingLabel = mail.removedAt ? 'Deleting message…' : 'Moving message to Trash…'
    const isDraft = mail.from === loggedinUser.email && !mail.sentAt && !mail.removedAt
    const mailHref = isDraft ? getDraftUrl(mail) : `/mail/${mail.id}`
    const rowLabel = isDraft
        ? `Edit draft: ${correspondent}, ${subject}, ${bodySnippet}, ${formattedDate}`
        : `${mail.isRead ? '' : 'Unread: '}${correspondent}, ${subject}, ${bodySnippet}, ${formattedDate}`

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
            <MailStarButton
                className="mail-row-star"
                mail={mail}
                onToggle={onToggleStar}
            />

            <Link
                className="mail-row-link"
                to={mailHref}
                data-mail-id={mail.id}
                aria-label={rowLabel}
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
                aria-label={`${isDeleting ? pendingLabel : deleteLabel}: ${subject}`}
                title={isDeleting ? pendingLabel : deleteLabel}
                disabled={isDeleting}
                onClick={onRemoveMail}
            >
                <i
                    className={isDeleting ? 'fa-solid fa-spinner fa-spin' : 'fa-regular fa-trash-can'}
                    aria-hidden="true"
                />
            </button>
        </li>
    )
}

function getDraftUrl(mail) {
    const searchParams = new URLSearchParams()
    searchParams.set('status', 'draft')
    searchParams.set('compose', 'true')
    searchParams.set('draftId', mail.id)
    searchParams.set('to', mail.to || '')
    searchParams.set('subject', mail.subject || '')
    searchParams.set('body', mail.body || '')

    return `/mail?${searchParams.toString()}`
}

function formatMailDate(timestamp) {
    if (!timestamp) return ''

    const mailDate = new Date(timestamp)
    if (Number.isNaN(mailDate.getTime())) return ''
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
