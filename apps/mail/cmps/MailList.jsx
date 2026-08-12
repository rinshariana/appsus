const { Link } = ReactRouterDOM

import { mailService } from '../services/mail.service.js'

export function MailList({ mails, isLoading }) {
    if (isLoading) {
        return <p className="mail-list-status" role="status">Loading mail…</p>
    }

    if (!mails.length) {
        return <p className="mail-list-status">This folder is empty.</p>
    }

    const loggedinUser = mailService.getLoggedinUser()

    return (
        <ul className="mail-list">
            {mails.map(mail => (
                <li className="mail-row" key={mail.id}>
                    <Link to={`/mail/${mail.id}`}>
                        <span className="mail-correspondent">
                            {mail.from === loggedinUser.email
                                ? `To: ${mail.to}`
                                : mail.from
                            }
                        </span>
                        <span className="mail-subject">{mail.subject || '(No subject)'}</span>
                        <time dateTime={new Date(mail.sentAt || mail.createdAt).toISOString()}>
                            {formatMailDate(mail.sentAt || mail.createdAt)}
                        </time>
                    </Link>
                </li>
            ))}
        </ul>
    )
}

function formatMailDate(timestamp) {
    if (!timestamp) return ''

    return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
    }).format(timestamp)
}
