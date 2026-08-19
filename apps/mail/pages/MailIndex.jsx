const { useEffect, useRef, useState } = React
const { Outlet, useMatch, useNavigate, useSearchParams } = ReactRouterDOM

import { showErrorMsg, showSuccessMsg } from '../../../services/event-bus.service.js'
import { MailCompose } from '../cmps/MailCompose.jsx'
import { MailFolderList } from '../cmps/MailFolderList.jsx'
import { MailHeader } from '../cmps/MailHeader.jsx'
import { MailList } from '../cmps/MailList.jsx'
import { MailToolbar } from '../cmps/MailToolbar.jsx'
import { mailService } from '../services/mail.service.js'

export function MailIndex() {
    const [searchParams] = useSearchParams()
    const statusFromUrl = mailService.getDefaultFilter({
        status: searchParams.get('status'),
    }).status
    const [mails, setMails] = useState([])
    const [filterBy, setFilterBy] = useState(() => {
        return mailService.getDefaultFilter({ status: statusFromUrl })
    })
    const [sortBy, setSortBy] = useState(mailService.getDefaultSort)
    const [unreadCount, setUnreadCount] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [isFolderDrawerOpen, setIsFolderDrawerOpen] = useState(false)
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
    const [refreshCount, setRefreshCount] = useState(0)
    const menuButtonRef = useRef(null)
    const drawerCloseButtonRef = useRef(null)
    const composeButtonRef = useRef(null)
    const composeOpenerRef = useRef(null)
    const drawerFocusTimeoutRef = useRef(null)
    const detailsReturnFocusIdRef = useRef(undefined)
    const navigate = useNavigate()
    const isDetailsOpen = Boolean(useMatch('/mail/:mailId'))
    const isComposeOpen = searchParams.get('compose') === 'true'
    const isMobile = useIsMobile()

    useEffect(() => {
        return () => clearTimeout(drawerFocusTimeoutRef.current)
    }, [])

    useEffect(() => {
        setFilterBy(prevFilter => {
            if (prevFilter.status === statusFromUrl) return prevFilter
            return { ...prevFilter, status: statusFromUrl }
        })
    }, [statusFromUrl])

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
        const nextSearchParams = new URLSearchParams(searchParams)
        nextSearchParams.set('status', status)
        navigate(getMailUrl(nextSearchParams))
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
        const nextSearchParams = new URLSearchParams()
        nextSearchParams.set('status', filterBy.status)
        nextSearchParams.set('compose', 'true')
        navigate(getMailUrl(nextSearchParams))
    }

    function onCloseCompose() {
        const nextSearchParams = new URLSearchParams(searchParams)
        clearComposeParams(nextSearchParams)
        if (!nextSearchParams.has('status')) {
            nextSearchParams.set('status', filterBy.status)
        }
        navigate(getMailUrl(nextSearchParams), { replace: true })
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

    function onToggleNavigation() {
        if (isMobile) onOpenFolderDrawer()
        else setIsSidebarCollapsed(isCollapsed => !isCollapsed)
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

    async function onSaveDraft(draft) {
        const now = Date.now()
        const loggedinUser = mailService.getLoggedinUser()
        const storedDraft = await getStoredMail(draft.id)
        const draftToSave = {
            ...storedDraft,
            ...draft,
            id: storedDraft ? storedDraft.id : undefined,
            createdAt: (storedDraft && storedDraft.createdAt) || draft.createdAt || now,
            sentAt: null,
            isRead: true,
            removedAt: null,
            from: loggedinUser.email,
        }

        try {
            const savedDraft = await mailService.save(draftToSave)

            if (filterBy.status === 'draft') {
                setRefreshCount(currentCount => currentCount + 1)
            }

            return savedDraft
        } catch (err) {
            console.error('Failed to save draft:', err)
            throw err
        }
    }

    async function onSendMail(draft) {
        const now = Date.now()
        const loggedinUser = mailService.getLoggedinUser()
        const storedDraft = await getStoredMail(draft.id)
        const mailToSend = {
            ...storedDraft,
            ...draft,
            id: storedDraft ? storedDraft.id : undefined,
            createdAt: (storedDraft && storedDraft.createdAt) || draft.createdAt || now,
            sentAt: now,
            isRead: true,
            removedAt: null,
            from: loggedinUser.email,
            to: draft.to.trim(),
        }

        try {
            const savedMail = await mailService.save(mailToSend)

            if (filterBy.status === 'sent' || filterBy.status === 'draft') {
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
        const nextSearchParams = new URLSearchParams()
        nextSearchParams.set('status', filterBy.status)
        navigate(getMailUrl(nextSearchParams))
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

    const folderTitle = filterBy.status === 'draft'
        ? 'Drafts'
        : filterBy.status.charAt(0).toUpperCase() + filterBy.status.slice(1)

    return (
        <section className={`mail-index ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            <MailHeader
                filterBy={filterBy}
                onSetFilter={onSetFilter}
                isSidebarCollapsed={isSidebarCollapsed}
                isFolderDrawerOpen={isFolderDrawerOpen}
                isMobile={isMobile}
                onToggleNavigation={onToggleNavigation}
                menuButtonRef={menuButtonRef}
            />

            <section className="mail-workspace">
                <MailFolderList
                    status={filterBy.status}
                    unreadCount={unreadCount}
                    isOpen={isFolderDrawerOpen}
                    isCollapsed={!isMobile && isSidebarCollapsed}
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
                            filterBy={filterBy}
                            sortBy={sortBy}
                            onSetFilter={onSetFilter}
                            onSetSort={onSetSort}
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
            </section>

            {isComposeOpen && (
                <MailCompose
                    onSend={onSendMail}
                    onSaveDraft={onSaveDraft}
                    onClose={onCloseCompose}
                />
            )}
        </section>
    )
}

async function getStoredMail(mailId) {
    if (!mailId) return null

    try {
        return await mailService.get(mailId)
    } catch (err) {
        return null
    }
}

function clearComposeParams(searchParams) {
    ['compose', 'draftId', 'to', 'subject', 'body'].forEach(paramName => {
        searchParams.delete(paramName)
    })
}

function getMailUrl(searchParams) {
    const queryString = searchParams.toString()
    return queryString ? `/mail?${queryString}` : '/mail'
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

