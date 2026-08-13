const { useEffect, useState } = React
const { Outlet, useMatch, useNavigate } = ReactRouterDOM

import { showErrorMsg, showSuccessMsg } from '../../../services/event-bus.service.js'
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
    const [refreshCount, setRefreshCount] = useState(0)
    const navigate = useNavigate()
    const isDetailsOpen = Boolean(useMatch('/mail/:mailId'))

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
        if (!isFolderDrawerOpen) return

        function onKeyDown(ev) {
            if (ev.key === 'Escape') setIsFolderDrawerOpen(false)
        }

        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [isFolderDrawerOpen])

    function onSelectFolder(status) {
        setIsLoading(true)
        setFilterBy(prevFilter => ({ ...prevFilter, status }))
        navigate('/mail')
        setIsFolderDrawerOpen(false)
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

    function onCloseDetails() {
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
                onClose={() => setIsFolderDrawerOpen(false)}
            />

            <main className={`mail-main ${isDetailsOpen ? 'details-open' : ''}`}>
                {!isDetailsOpen && (
                    <MailToolbar
                        folderTitle={folderTitle}
                        messageCount={mails.length}
                        isLoading={isLoading}
                        isMenuOpen={isFolderDrawerOpen}
                        onOpenMenu={() => setIsFolderDrawerOpen(true)}
                    />
                )}

                <section className="mail-content">
                    {isDetailsOpen
                        ? <Outlet context={{
                            mails,
                            onMarkAsRead,
                            onDeleteMail,
                            onCloseDetails,
                        }} />
                        : <MailList
                            mails={mails}
                            isLoading={isLoading}
                            onDeleteMail={onDeleteMail}
                        />
                    }
                </section>
            </main>
        </section>
    )
}

