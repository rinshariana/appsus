const { useEffect, useRef, useState } = React

import { mailService } from '../services/mail.service.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function MailCompose({ onSend, onClose }) {
    const [mail, setMail] = useState(() => mailService.getEmptyMail())
    const [recipientError, setRecipientError] = useState('')
    const [submitError, setSubmitError] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [isMobile, setIsMobile] = useState(() => {
        return window.matchMedia('(max-width: 719px)').matches
    })
    const dialogRef = useRef(null)
    const loggedinUser = mailService.getLoggedinUser()

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 719px)')
        const onChange = event => setIsMobile(event.matches)

        mediaQuery.addEventListener('change', onChange)
        return () => mediaQuery.removeEventListener('change', onChange)
    }, [])

    useEffect(() => {
        const inertElements = isMobile
            ? [
                document.querySelector('.app-header'),
                document.querySelector('.mail-folder-list'),
                document.querySelector('.mail-main'),
            ].filter(Boolean)
            : []

        inertElements.forEach(element => {
            element.inert = true
        })

        function onKeyDown(ev) {
            if (ev.key === 'Escape' && !isSending) {
                onClose()
                return
            }

            if (ev.key !== 'Tab' || !isMobile) return

            const focusableElements = dialogRef.current
                ? Array.from(dialogRef.current.querySelectorAll(
                    'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])'
                ))
                : []
            if (!focusableElements.length) return

            const firstElement = focusableElements[0]
            const lastElement = focusableElements[focusableElements.length - 1]

            if (ev.shiftKey && document.activeElement === firstElement) {
                ev.preventDefault()
                lastElement.focus()
            } else if (!ev.shiftKey && document.activeElement === lastElement) {
                ev.preventDefault()
                firstElement.focus()
            }
        }

        window.addEventListener('keydown', onKeyDown)
        return () => {
            window.removeEventListener('keydown', onKeyDown)
            inertElements.forEach(element => {
                element.inert = false
            })
        }
    }, [isMobile, isSending, onClose])

    function onChange({ target }) {
        const { name, value } = target

        setMail(prevMail => ({ ...prevMail, [name]: value }))
        if (name === 'to') setRecipientError('')
        setSubmitError('')
    }

    async function onSubmit(ev) {
        ev.preventDefault()
        if (isSending) return

        const recipient = mail.to.trim()
        if (!EMAIL_PATTERN.test(recipient)) {
            setRecipientError('Enter a valid email address.')
            return
        }

        setIsSending(true)
        setRecipientError('')
        setSubmitError('')

        try {
            await onSend({ ...mail, to: recipient })
            onClose()
        } catch (err) {
            setSubmitError('Your message was not sent. Please try again.')
            setIsSending(false)
        }
    }

    return (
        <section
            className="mail-compose"
            ref={dialogRef}
            role="dialog"
            aria-modal={isMobile}
            aria-labelledby="mail-compose-title"
        >
            <header className="mail-compose-header">
                <h2 id="mail-compose-title">New Message</h2>
                <button
                    type="button"
                    aria-label="Close compose"
                    title="Close compose"
                    disabled={isSending}
                    onClick={onClose}
                >
                    <i className="fa-solid fa-xmark" aria-hidden="true" />
                </button>
            </header>

            <form className="mail-compose-form" noValidate onSubmit={onSubmit}>
                <label className="mail-compose-field mail-compose-from">
                    <span>From</span>
                    <input
                        type="email"
                        value={loggedinUser.email}
                        readOnly
                        aria-readonly="true"
                    />
                </label>

                <label className={`mail-compose-field ${recipientError ? 'invalid' : ''}`}>
                    <span>To</span>
                    <input
                        type="email"
                        name="to"
                        value={mail.to}
                        autoFocus
                        required
                        disabled={isSending}
                        aria-invalid={Boolean(recipientError)}
                        aria-describedby={recipientError ? 'mail-recipient-error' : undefined}
                        onChange={onChange}
                    />
                </label>
                {recipientError && (
                    <p className="mail-compose-error" id="mail-recipient-error" role="alert">
                        {recipientError}
                    </p>
                )}

                <label className="mail-compose-field mail-compose-subject">
                    <span className="mail-visually-hidden">Subject</span>
                    <input
                        type="text"
                        name="subject"
                        value={mail.subject}
                        placeholder="Subject"
                        disabled={isSending}
                        onChange={onChange}
                    />
                </label>

                <label className="mail-compose-body">
                    <span className="mail-visually-hidden">Message body</span>
                    <textarea
                        name="body"
                        value={mail.body}
                        placeholder="Write a message"
                        disabled={isSending}
                        onChange={onChange}
                    />
                </label>

                {submitError && (
                    <p className="mail-compose-error mail-compose-submit-error" role="alert">
                        {submitError}
                    </p>
                )}

                <footer className="mail-compose-footer">
                    <button className="mail-send-btn" type="submit" disabled={isSending}>
                        {isSending && <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />}
                        <span>{isSending ? 'Sending…' : 'Send'}</span>
                    </button>
                </footer>
            </form>
        </section>
    )
}
