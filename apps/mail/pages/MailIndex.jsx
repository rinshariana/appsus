const { useEffect, useState } = React
const { Outlet, useMatch, useNavigate } = ReactRouterDOM

import { showErrorMsg } from '../../../services/event-bus.service.js'
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
    }, [filterBy, sortBy])

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

            <main className="mail-main">
                <MailToolbar
                    folderTitle={folderTitle}
                    messageCount={mails.length}
                    isLoading={isLoading}
                    isMenuOpen={isFolderDrawerOpen}
                    onOpenMenu={() => setIsFolderDrawerOpen(true)}
                />

                <section className="mail-content">
                    {isDetailsOpen
                        ? <Outlet />
                        : <MailList mails={mails} isLoading={isLoading} />
                    }
                </section>
            </main>
        </section>
    )
}

