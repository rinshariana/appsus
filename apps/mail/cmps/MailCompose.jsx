const { useEffect, useRef, useState } = React
const { useSearchParams } = ReactRouterDOM

import { mailService } from '../services/mail.service.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const AUTOSAVE_INTERVAL = 5000

export function MailCompose({ onSend, onSaveDraft, onClose }) {
    const [searchParams, setSearchParams] = useSearchParams()
    const [recipientError, setRecipientError] = useState('')
    const [submitError, setSubmitError] = useState('')
    const [draftError, setDraftError] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [isFinalizing, setIsFinalizing] = useState(false)
    const [isMobile, setIsMobile] = useState(() => {
        return window.matchMedia('(max-width: 719px)').matches
    })
    const dialogRef = useRef(null)
    const searchParamsRef = useRef(searchParams)
    const onSaveDraftRef = useRef(onSaveDraft)
    const savePromiseRef = useRef(null)
    const isMountedRef = useRef(true)
    const isSendingRef = useRef(false)
    const isFinalizingRef = useRef(false)
    const requestCloseRef = useRef(null)
    const initialMailRef = useRef(getMailFromSearchParams(searchParams))
    const isDirtyRef = useRef(
        !initialMailRef.current.id && hasDraftContent(initialMailRef.current)
    )
    const loggedinUser = mailService.getLoggedinUser()
    const mail = getMailFromSearchParams(searchParams)
    const isBusy = isSending || isFinalizing

    searchParamsRef.current = searchParams
    onSaveDraftRef.current = onSaveDraft

    useEffect(() => {
        return () => {
            isMountedRef.current = false
        }
    }, [])

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 719px)')
        const onChange = event => setIsMobile(event.matches)

        mediaQuery.addEventListener('change', onChange)
        return () => mediaQuery.removeEventListener('change', onChange)
    }, [])

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            if (isSendingRef.current) return
            persistDirtyDraft().catch(() => {})
        }, AUTOSAVE_INTERVAL)

        return () => window.clearInterval(intervalId)
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
            if (ev.key === 'Escape' && !isSendingRef.current) {
                requestCloseRef.current()
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
    }, [isMobile])

    function onChange({ target }) {
        const { name, value } = target
        const nextSearchParams = new URLSearchParams(searchParamsRef.current)

        nextSearchParams.set(name, value)
        updateSearchParams(nextSearchParams)
        isDirtyRef.current = true
        if (name === 'to') setRecipientError('')
        setSubmitError('')
    }

    async function onSubmit(ev) {
        ev.preventDefault()
        if (isSendingRef.current || isFinalizingRef.current) return

        const currentMail = getMailFromSearchParams(searchParamsRef.current)
        const recipient = currentMail.to.trim()
        if (!EMAIL_PATTERN.test(recipient)) {
            setRecipientError('Enter a valid email address.')
            return
        }

        isSendingRef.current = true
        setIsSending(true)
        setRecipientError('')
        setSubmitError('')

        try {
            await persistDirtyDraft({ force: true })
            const mailToSend = getMailFromSearchParams(searchParamsRef.current)
            await onSend({ ...mailToSend, to: recipient })
            onClose()
        } catch (err) {
            if (!isMountedRef.current) return
            setSubmitError('Your message was not sent. Please try again.')
            isSendingRef.current = false
            setIsSending(false)
        }
    }

    async function requestClose() {
        if (isSendingRef.current || isFinalizingRef.current) return

        isFinalizingRef.current = true
        setIsFinalizing(true)
        try {
            await persistDirtyDraft({ force: true })
            onClose()
        } catch (err) {
            isFinalizingRef.current = false
            if (isMountedRef.current) setIsFinalizing(false)
        }
    }

    requestCloseRef.current = requestClose

    async function persistDirtyDraft({ force = false } = {}) {
        if (savePromiseRef.current) {
            try {
                await savePromiseRef.current
            } catch (err) {
                // The failed save marks the draft dirty for a retry below.
            }

            if (force && isDirtyRef.current) {
                return persistDirtyDraft({ force: true })
            }
            return null
        }

        if (!isDirtyRef.current) return null

        const draft = getMailFromSearchParams(searchParamsRef.current)
        if (!draft.id && !hasDraftContent(draft)) {
            isDirtyRef.current = false
            if (isMountedRef.current) setDraftError('')
            return null
        }

        isDirtyRef.current = false
        const savePromise = onSaveDraftRef.current(draft)
        savePromiseRef.current = savePromise

        try {
            const savedDraft = await savePromise
            const nextSearchParams = new URLSearchParams(searchParamsRef.current)

            nextSearchParams.set('draftId', savedDraft.id)
            updateSearchParams(nextSearchParams)
            if (isMountedRef.current) setDraftError('')
            return savedDraft
        } catch (err) {
            isDirtyRef.current = true
            if (isMountedRef.current) {
                setDraftError('Could not save draft. Retrying automatically…')
            }
            throw err
        } finally {
            if (savePromiseRef.current === savePromise) {
                savePromiseRef.current = null
            }
        }
    }

    function updateSearchParams(nextSearchParams) {
        searchParamsRef.current = nextSearchParams
        setSearchParams(nextSearchParams, { replace: true })
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
                <h2 id="mail-compose-title">{mail.id ? 'Draft' : 'New Message'}</h2>
                <button
                    type="button"
                    aria-label="Close compose"
                    title="Close compose"
                    disabled={isBusy}
                    onClick={requestClose}
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
                        disabled={isBusy}
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
                        disabled={isBusy}
                        onChange={onChange}
                    />
                </label>

                <label className="mail-compose-body">
                    <span className="mail-visually-hidden">Message body</span>
                    <textarea
                        name="body"
                        value={mail.body}
                        placeholder="Write a message"
                        disabled={isBusy}
                        onChange={onChange}
                    />
                </label>

                {draftError && (
                    <p className="mail-compose-error mail-compose-submit-error" role="alert">
                        {draftError}
                    </p>
                )}

                {submitError && (
                    <p className="mail-compose-error mail-compose-submit-error" role="alert">
                        {submitError}
                    </p>
                )}

                <footer className="mail-compose-footer">
                    <button className="mail-send-btn" type="submit" disabled={isBusy}>
                        {isSending && <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />}
                        <span>{isSending ? 'Sending…' : 'Send'}</span>
                    </button>

                    <button
                        className="mail-note-btn"
                        type="button"
                        aria-label="Save as note — coming soon"
                        title="Save as note — coming soon"
                        disabled
                    >
                        <i className="fa-solid fa-arrow-up-from-bracket" aria-hidden="true" />
                    </button>
                </footer>
            </form>
        </section>
    )
}

function getMailFromSearchParams(searchParams) {
    const emptyMail = mailService.getEmptyMail()
    const draftId = searchParams.get('draftId')

    return {
        ...emptyMail,
        id: draftId || undefined,
        to: searchParams.get('to') || '',
        subject: searchParams.get('subject') || '',
        body: searchParams.get('body') || '',
    }
}

function hasDraftContent(mail) {
    return [mail.to, mail.subject, mail.body].some(value => value.trim())
}
