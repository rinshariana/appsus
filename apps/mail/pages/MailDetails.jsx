const { useEffect, useState } = React
const { useNavigate, useOutletContext, useParams } = ReactRouterDOM

import { showErrorMsg } from '../../../services/event-bus.service.js'
import { mailService } from '../services/mail.service.js'

export function MailDetails() {
    const [mail, setMail] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)
    const { mailId } = useParams()
    const navigate = useNavigate()
    const {
        mails,
        onMarkAsRead,
        onDeleteMail,
        onCloseDetails,
    } = useOutletContext()

    useEffect(() => {
        let isActive = true

        setMail(null)
        setIsLoading(true)
        setIsDeleting(false)
        loadMail()

        return () => {
            isActive = false
        }

        async function loadMail() {
            let loadedMail

            try {
                loadedMail = await mailService.get(mailId)
            } catch (err) {
                if (!isActive) return
                showErrorMsg('Message not found.')
                console.warn('Mail details route not found:', err)
                navigate('/mail', { replace: true })
                return
            }

            if (!isActive) return

            if (!loadedMail.isRead) {
                try {
                    loadedMail = await onMarkAsRead(loadedMail)
                } catch (err) {
                    // The parent action reports the persistence failure.
                }
            }

            if (!isActive) return
            setMail(loadedMail)
            setIsLoading(false)
        }
    }, [mailId])

    if (isLoading) {
        return (
            <section className="mail-details mail-details-status" role="status">
                <span className="mail-visually-hidden">Loading message…</span>
                <span className="mail-details-loading-actions" aria-hidden="true">
                    <span className="mail-loading-circle" />
                    <span className="mail-loading-circle" />
                </span>
                <span className="mail-details-loading-message" aria-hidden="true">
                    <span className="mail-loading-bar subject" />
                    <span className="mail-loading-sender">
                        <span className="mail-loading-circle avatar" />
                        <span className="mail-loading-bar address" />
                        <span className="mail-loading-bar timestamp" />
                    </span>
                    <span className="mail-loading-bar body-line long" />
                    <span className="mail-loading-bar body-line medium" />
                </span>
            </section>
        )
    }

    if (!mail) return null

    const currentMailIdx = mails.findIndex(currentMail => currentMail.id === mail.id)
    const previousMail = currentMailIdx > 0 ? mails[currentMailIdx - 1] : null
    const nextMail = currentMailIdx >= 0 && currentMailIdx < mails.length - 1
        ? mails[currentMailIdx + 1]
        : null
    const deleteLabel = mail.removedAt ? 'Delete forever' : 'Move to Trash'
    const pendingDeleteLabel = mail.removedAt ? 'Deleting message…' : 'Moving message to Trash…'
    const subject = mail.subject || '(No subject)'
    const senderInitial = (mail.from || '?').charAt(0).toUpperCase()

    async function onRemoveMail() {
        if (isDeleting) return

        setIsDeleting(true)
        try {
            await onDeleteMail(mail)
            onCloseDetails()
        } catch (err) {
            setIsDeleting(false)
        }
    }

    function onNavigateToMail(targetMail) {
        if (!targetMail || isDeleting) return
        navigate(`/mail/${targetMail.id}`)
    }

    return (
        <article className="mail-details">
            <nav className="mail-details-actions" aria-label="Message actions">
                <button
                    className="mail-details-action"
                    type="button"
                    aria-label="Back to mail"
                    title="Back to mail"
                    disabled={isDeleting}
                    onClick={onCloseDetails}
                >
                    <i className="fa-solid fa-arrow-left" aria-hidden="true" />
                </button>

                <button
                    className="mail-details-action"
                    type="button"
                    aria-label={isDeleting ? pendingDeleteLabel : deleteLabel}
                    title={isDeleting ? pendingDeleteLabel : deleteLabel}
                    disabled={isDeleting}
                    onClick={onRemoveMail}
                >
                    <i
                        className={isDeleting ? 'fa-solid fa-spinner fa-spin' : 'fa-regular fa-trash-can'}
                        aria-hidden="true"
                    />
                </button>

                <span className="mail-details-action-spacer" />

                <button
                    className="mail-details-action"
                    type="button"
                    aria-label="Previous message"
                    title="Previous message"
                    disabled={!previousMail || isDeleting}
                    onClick={() => onNavigateToMail(previousMail)}
                >
                    <i className="fa-solid fa-chevron-left" aria-hidden="true" />
                </button>

                <button
                    className="mail-details-action"
                    type="button"
                    aria-label="Next message"
                    title="Next message"
                    disabled={!nextMail || isDeleting}
                    onClick={() => onNavigateToMail(nextMail)}
                >
                    <i className="fa-solid fa-chevron-right" aria-hidden="true" />
                </button>
            </nav>

            <section className="mail-details-message">
                <h2>{subject}</h2>

                <header className="mail-details-sender">
                    <span className="mail-details-avatar" aria-hidden="true">
                        {senderInitial}
                    </span>

                    <span className="mail-details-addresses">
                        <strong>{mail.from}</strong>
                        <span>to {mail.to}</span>
                    </span>

                    <time dateTime={new Date(mail.sentAt || mail.createdAt).toISOString()}>
                        {formatFullDate(mail.sentAt || mail.createdAt)}
                    </time>
                </header>

                <p className="mail-details-body">{mail.body || 'No message body'}</p>
            </section>
        </article>
    )
}

function formatFullDate(timestamp) {
    return new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(timestamp)
}
