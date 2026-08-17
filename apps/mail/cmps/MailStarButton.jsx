const { useState } = React

export function MailStarButton({ mail, onToggle, className = '' }) {
    const [isToggling, setIsToggling] = useState(false)
    const actionLabel = mail.isStarred ? 'Remove star' : 'Add star'
    const pendingLabel = mail.isStarred ? 'Removing star…' : 'Adding star…'
    const subject = mail.subject || '(No subject)'
    const iconClass = isToggling ? 'fa-solid fa-star fa-jello' : mail.isStarred ? 'fa-solid fa-star' : 'fa-regular fa-star'

    async function onToggleStar() {
        if (isToggling) return

        setIsToggling(true)
        try {
            await onToggle(mail)
        } catch (err) {
            // The owning action reports the persistence failure.
        } finally {
            setIsToggling(false)
        }
    }

    return (
        <button
            className={`mail-star-btn ${className}`.trim()}
            type="button"
            aria-label={`${isToggling ? pendingLabel : actionLabel}: ${subject}`}
            aria-pressed={mail.isStarred}
            title={isToggling ? pendingLabel : actionLabel}
            disabled={isToggling}
            onClick={onToggleStar}
        >
            <i
                key={iconClass}
                className={iconClass}
                aria-hidden="true"
            />
        </button>
    )
}
