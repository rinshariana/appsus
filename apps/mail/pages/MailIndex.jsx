const { useEffect, useRef, useState } = React
const { Outlet, useMatch, useNavigate } = ReactRouterDOM

import { showErrorMsg, showSuccessMsg } from '../../../services/event-bus.service.js'
import { MailCompose } from '../cmps/MailCompose.jsx'
import { MailFolderList } from '../cmps/MailFolderList.jsx'
import { MailList } from '../cmps/MailList.jsx'
import { MailToolbar } from '../cmps/MailToolbar.jsx'
import { mailService } from '../services/mail.service.js'

export function MailIndex() {
    const [mails, setMails] = useState([])
    const [filterBy, setFilterBy] = useState(mailService.getDefaultFilter)
    const [sortBy, setSortBy] = useState(mailService.getDefaultSort)
    const [unreadCount, setUnreadCount] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [isFolderDrawerOpen, setIsFolderDrawerOpen] = useState(false)
    const [isComposeOpen, setIsComposeOpen] = useState(false)
    const [refreshCount, setRefreshCount] = useState(0)
    const menuButtonRef = useRef(null)
    const drawerCloseButtonRef = useRef(null)
    const composeButtonRef = useRef(null)
    const composeOpenerRef = useRef(null)
    const drawerFocusTimeoutRef = useRef(null)
    const detailsReturnFocusIdRef = useRef(undefined)
    const navigate = useNavigate()
    const isDetailsOpen = Boolean(useMatch('/mail/:mailId'))
    const isMobile = useIsMobile()

    useEffect(() => {
        return () => clearTimeout(drawerFocusTimeoutRef.current)
    }, [])

    useEffect(() => {
        let isActive = true

        setIsLoading(true)
        Promise.all([
            mailService.query(filterBy, sortBy),
            mailService.getUnreadCount(),
        ])
            .then(([loadedMails, loadedUnreadCount]) => {
                if (!isActive) return
                setMails(loadedMails)
                setUnreadCount(loadedUnreadCount)
            })
            .catch(err => {
                if (!isActive) return
                setMails([])
                showErrorMsg('Could not load mail. Please try again.')
                console.error('Failed to load mail:', err)
            })
            .finally(() => {
                if (isActive) setIsLoading(false)
            })

        return () => {
            isActive = false
        }
    }, [filterBy, sortBy, refreshCount])

    useEffect(() => {
        if (!isFolderDrawerOpen || !isMobile) return

        const inertElements = [
            document.querySelector('.app-header'),
            document.querySelector('.mail-main'),
        ].filter(Boolean)

        inertElements.forEach(element => {
            element.inert = true
        })
        function onKeyDown(ev) {
            if (ev.key === 'Escape') onCloseFolderDrawer()
        }

        window.addEventListener('keydown', onKeyDown)
        return () => {
            window.removeEventListener('keydown', onKeyDown)
            inertElements.forEach(element => {
                element.inert = false
            })
        }
    }, [isFolderDrawerOpen, isMobile])

    useEffect(() => {
        if (isDetailsOpen || isLoading || detailsReturnFocusIdRef.current === undefined) return

        const mailId = detailsReturnFocusIdRef.current
        detailsReturnFocusIdRef.current = undefined

        requestAnimationFrame(() => {
            const target = mailId
                ? document.querySelector(`[data-mail-id="${mailId}"]`)
                : null
            const fallback = document.querySelector('.mail-toolbar h1')
            const focusTarget = target || fallback
            if (focusTarget) focusTarget.focus()
        })
    }, [isDetailsOpen, isLoading, mails])

    function onSelectFolder(status) {
        setIsLoading(true)
        setFilterBy(prevFilter => ({ ...prevFilter, status }))
        navigate('/mail')
        onCloseFolderDrawer()
    }

    function onSetFilter(partialFilter) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...partialFilter }))
    }

    function onSetSort(partialSort) {
        setSortBy(prevSort => ({ ...prevSort, ...partialSort }))
    }

    function onOpenCompose() {
        composeOpenerRef.current = isMobile
            ? menuButtonRef.current
            : document.activeElement
        setIsFolderDrawerOpen(false)
        setIsComposeOpen(true)
    }

    function onCloseCompose() {
        setIsComposeOpen(false)
        requestAnimationFrame(() => {
            if (composeOpenerRef.current) composeOpenerRef.current.focus()
        })
    }

    function onOpenFolderDrawer() {
        setIsFolderDrawerOpen(true)
        clearTimeout(drawerFocusTimeoutRef.current)
        drawerFocusTimeoutRef.current = setTimeout(() => {
            const closeButton = drawerCloseButtonRef.current ||
                document.querySelector('.mail-drawer-close')
            if (closeButton) closeButton.focus()
        }, 200)
    }

    function onCloseFolderDrawer() {
        clearTimeout(drawerFocusTimeoutRef.current)
        setIsFolderDrawerOpen(false)
        if (isMobile) {
            requestAnimationFrame(() => {
                if (menuButtonRef.current) menuButtonRef.current.focus()
            })
        }
    }

    async function onSendMail(draft) {
        const now = Date.now()
        const loggedinUser = mailService.getLoggedinUser()
        const mailToSend = {
            ...draft,
            createdAt: now,
            sentAt: now,
            isRead: true,
            removedAt: null,
            from: loggedinUser.email,
            to: draft.to.trim(),
        }

        try {
            const savedMail = await mailService.save(mailToSend)

            if (filterBy.status === 'sent') {
                setRefreshCount(currentCount => currentCount + 1)
            }

            showSuccessMsg('Message sent.')
            return savedMail
        } catch (err) {
            showErrorMsg('Could not send message.')
            console.error('Failed to send mail:', err)
            throw err
        }
    }

    async function onMarkAsRead(mail) {
        if (mail.isRead) return mail

        try {
            const savedMail = await mailService.save({ ...mail, isRead: true })

            setMails(currentMails => currentMails.map(currentMail => {
                return currentMail.id === savedMail.id ? savedMail : currentMail
            }))
            await refreshUnreadCount()

            return savedMail
        } catch (err) {
            showErrorMsg('Could not mark this message as read.')
            console.error('Failed to mark mail as read:', err)
            throw err
        }
    }

    async function onDeleteMail(mail) {
        const isPermanentDelete = Boolean(mail.removedAt)

        try {
            if (isPermanentDelete) await mailService.remove(mail.id)
            else await mailService.moveToTrash(mail.id)

            setMails(currentMails => {
                return currentMails.filter(currentMail => currentMail.id !== mail.id)
            })
            await refreshUnreadCount()
            showSuccessMsg(isPermanentDelete
                ? 'Message deleted permanently.'
                : 'Message moved to Trash.'
            )
        } catch (err) {
            showErrorMsg(isPermanentDelete
                ? 'Could not delete this message permanently.'
                : 'Could not move this message to Trash.'
            )
            console.error('Failed to delete mail:', err)
            throw err
        }
    }

    async function onToggleStar(mail) {
        try {
            const savedMail = await mailService.toggleStar(mail.id)

            setMails(currentMails => {
                if (filterBy.status === 'starred' && !savedMail.isStarred) {
                    return currentMails.filter(currentMail => currentMail.id !== savedMail.id)
                }

                return currentMails.map(currentMail => {
                    return currentMail.id === savedMail.id ? savedMail : currentMail
                })
            })

            return savedMail
        } catch (err) {
            showErrorMsg('Could not update the star for this message.')
            console.error('Failed to update mail star:', err)
            throw err
        }
    }

    function onCloseDetails(mailId = null) {
        detailsReturnFocusIdRef.current = mailId
        setIsLoading(true)
        navigate('/mail')
        setRefreshCount(currentCount => currentCount + 1)
    }

    async function refreshUnreadCount() {
        try {
            const loadedUnreadCount = await mailService.getUnreadCount()
            setUnreadCount(loadedUnreadCount)
        } catch (err) {
            showErrorMsg('Could not refresh the unread count.')
            console.error('Failed to refresh unread count:', err)
        }
    }

    const folderTitle = filterBy.status.charAt(0).toUpperCase() + filterBy.status.slice(1)

    return (
        <section className="mail-index">
            <MailFolderList
                status={filterBy.status}
                unreadCount={unreadCount}
                isOpen={isFolderDrawerOpen}
                onSelectFolder={onSelectFolder}
                onClose={onCloseFolderDrawer}
                onCompose={onOpenCompose}
                composeButtonRef={composeButtonRef}
                closeButtonRef={drawerCloseButtonRef}
                isMobile={isMobile}
            />

            <main className={`mail-main ${isDetailsOpen ? 'details-open' : ''}`}>
                {!isDetailsOpen && (
                    <MailToolbar
                        folderTitle={folderTitle}
                        messageCount={mails.length}
                        isLoading={isLoading}
                        isMenuOpen={isFolderDrawerOpen}
                        filterBy={filterBy}
                        sortBy={sortBy}
                        onOpenMenu={onOpenFolderDrawer}
                        onSetFilter={onSetFilter}
                        onSetSort={onSetSort}
                        menuButtonRef={menuButtonRef}
                    />
                )}

                <section className="mail-content">
                    {isDetailsOpen
                        ? <Outlet context={{
                            mails,
                            onMarkAsRead,
                            onDeleteMail,
                            onToggleStar,
                            onCloseDetails,
                        }} />
                        : <MailList
                            mails={mails}
                            isLoading={isLoading}
                            hasActiveFilters={Boolean(filterBy.txt.trim()) || filterBy.isRead !== null}
                            onDeleteMail={onDeleteMail}
                            onToggleStar={onToggleStar}
                        />
                    }
                </section>
            </main>

            {isComposeOpen && (
                <MailCompose
                    onSend={onSendMail}
                    onClose={onCloseCompose}
                />
            )}
        </section>
    )
}

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(() => {
        return window.matchMedia('(max-width: 719px)').matches
    })

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 719px)')
        const onChange = event => setIsMobile(event.matches)

        mediaQuery.addEventListener('change', onChange)
        return () => mediaQuery.removeEventListener('change', onChange)
    }, [])

    return isMobile
}

