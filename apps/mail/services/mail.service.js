import { storageService } from '../../../services/async-storage.service.js'
import { utilService } from '../../../services/util.service.js'

const MAIL_KEY = 'mailDB'
const MAIL_STATUSES = ['inbox', 'starred', 'sent', 'trash', 'draft']

const loggedinUser = {
    email: 'user@appsus.com',
    fullname: 'Mahatma Appsus',
}

_createMails()

export const mailService = {
    query,
    get,
    save,
    toggleStar,
    moveToTrash,
    remove,
    getUnreadCount,
    getDefaultFilter,
    getDefaultSort,
    getEmptyMail,
    getLoggedinUser,
}

if (typeof window !== 'undefined') window.mailService = mailService

function query(filterBy = {}, sortBy = {}) {
    filterBy = getDefaultFilter(filterBy)
    sortBy = getDefaultSort(sortBy)

    return storageService.query(MAIL_KEY)
        .then(mails => {
            mails = mails.map(_normalizeMail)
            const filteredMails = mails.filter(mail => {
                return _isInFolder(mail, filterBy.status) &&
                    _matchesText(mail, filterBy.txt) &&
                    _matchesReadState(mail, filterBy.isRead)
            })

            return filteredMails.sort((mailA, mailB) => {
                return _compareMails(mailA, mailB, sortBy)
            })
        })
}

function get(mailId) {
    return storageService.get(MAIL_KEY, mailId)
        .then(_normalizeMail)
}

function save(mail) {
    const mailToSave = _normalizeMail(mail)

    if (mailToSave.id) return storageService.put(MAIL_KEY, mailToSave)
    return storageService.post(MAIL_KEY, mailToSave)
}

function toggleStar(mailId) {
    return get(mailId)
        .then(mail => save({ ...mail, isStarred: !mail.isStarred }))
}

function moveToTrash(mailId) {
    return get(mailId)
        .then(mail => save({ ...mail, removedAt: Date.now() }))
}

function remove(mailId) {
    return storageService.remove(MAIL_KEY, mailId)
}

function getUnreadCount() {
    return query({ status: 'inbox', isRead: false })
        .then(mails => mails.length)
}

function getDefaultFilter(filterBy = {}) {
    const status = MAIL_STATUSES.includes(filterBy.status)
        ? filterBy.status
        : 'inbox'

    return {
        status,
        txt: filterBy.txt || '',
        isRead: typeof filterBy.isRead === 'boolean'
            ? filterBy.isRead
            : null,
    }
}

function getDefaultSort(sortBy = {}) {
    return {
        field: sortBy.field === 'subject' ? 'subject' : 'sentAt',
        direction: sortBy.direction === 1 ? 1 : -1,
    }
}

function getEmptyMail() {
    return {
        createdAt: Date.now(),
        subject: '',
        body: '',
        isRead: true,
        sentAt: null,
        removedAt: null,
        from: loggedinUser.email,
        to: '',
    }
}

function getLoggedinUser() {
    return { ...loggedinUser }
}

function _isInFolder(mail, status) {
    if (status === 'trash') return Boolean(mail.removedAt)
    if (mail.removedAt) return false
    if (status === 'starred') return mail.isStarred

    if (status === 'sent') {
        return mail.from === loggedinUser.email && Boolean(mail.sentAt)
    }

    if (status === 'draft') {
        return mail.from === loggedinUser.email && !mail.sentAt
    }

    return mail.to === loggedinUser.email
}

function _matchesText(mail, txt) {
    if (!txt.trim()) return true

    const searchTerm = txt.trim().toLowerCase()
    const searchableFields = [mail.subject, mail.body, mail.from, mail.to]

    return searchableFields.some(field => {
        return String(field || '').toLowerCase().includes(searchTerm)
    })
}

function _matchesReadState(mail, isRead) {
    if (typeof isRead !== 'boolean') return true
    return mail.isRead === isRead
}

function _compareMails(mailA, mailB, sortBy) {
    const { field, direction } = sortBy

    if (field === 'subject') {
        const subjectA = String(mailA.subject || '').toLowerCase()
        const subjectB = String(mailB.subject || '').toLowerCase()

        return subjectA.localeCompare(subjectB) * direction
    }

    const dateA = mailA.sentAt || mailA.createdAt || 0
    const dateB = mailB.sentAt || mailB.createdAt || 0

    return (dateA - dateB) * direction
}

function _createMails() {
    const storedMails = utilService.loadFromStorage(MAIL_KEY)
    if (storedMails && storedMails.length) return

    const now = Date.now()
    const day = 1000 * 60 * 60 * 24
    const mails = [
        _createMail({
            id: 'm101',
            createdAt: now - day,
            sentAt: now - day,
            subject: 'Welcome to Appsus',
            body: 'Your Appsus workspace is ready. Start exploring your mail and notes.',
            isRead: false,
            isStarred: true,
            from: 'team@appsus.com',
        }),
        _createMail({
            id: 'm102',
            createdAt: now - day * 2,
            sentAt: now - day * 2,
            subject: 'Sprint planning reminder',
            body: 'Remember to bring your task breakdown to tomorrow morning planning session.',
            isRead: true,
            from: 'maya@coding.academy',
        }),
        _createMail({
            id: 'm103',
            createdAt: now - day * 3,
            sentAt: now - day * 3,
            subject: 'Photos from the weekend',
            body: 'I uploaded the photos from our hike. There are some great views in the album.',
            isRead: false,
            from: 'noa@example.com',
        }),
        _createMail({
            id: 'm104',
            createdAt: now - day * 5,
            sentAt: now - day * 5,
            subject: 'Your monthly activity report',
            body: 'Here is a summary of your activity for the previous month.',
            isRead: true,
            from: 'reports@appsus.com',
        }),
        _createMail({
            id: 'm105',
            createdAt: now - day * 8,
            sentAt: now - day * 8,
            subject: 'Dinner next Thursday?',
            body: 'Are you free for dinner next Thursday evening? Let me know what works.',
            isRead: false,
            from: 'dana@example.com',
        }),
        _createMail({
            id: 'm106',
            createdAt: now - day * 12,
            sentAt: now - day * 12,
            subject: 'Receipt for your subscription',
            body: 'Thank you for your payment. Your receipt is available in your account.',
            isRead: true,
            from: 'billing@example.com',
        }),
        _createMail({
            id: 'm107',
            createdAt: now - day * 2.5,
            sentAt: now - day * 2.5,
            subject: 'Project files',
            body: 'I attached the updated project notes and the latest feature checklist.',
            isRead: true,
            isStarred: true,
            from: loggedinUser.email,
            to: 'alex@example.com',
        }),
        _createMail({
            id: 'm108',
            createdAt: now - day * 6,
            sentAt: now - day * 6,
            subject: 'Re: Weekend plans',
            body: 'Saturday morning works for me. I will send the address later this week.',
            isRead: true,
            from: loggedinUser.email,
            to: 'noa@example.com',
        }),
        _createMail({
            id: 'm109',
            createdAt: now - day * 10,
            sentAt: now - day * 10,
            subject: 'Thanks for your help',
            body: 'Thanks again for reviewing my work and sharing such useful feedback.',
            isRead: true,
            from: loggedinUser.email,
            to: 'maya@coding.academy',
        }),
        _createMail({
            id: 'm110',
            createdAt: now - day * 14,
            sentAt: now - day * 14,
            removedAt: now - day * 4,
            subject: 'Limited-time promotion',
            body: 'This promotion has expired and is no longer available.',
            isRead: true,
            from: 'offers@example.com',
        }),
        _createMail({
            id: 'm111',
            createdAt: now - day * 18,
            sentAt: now - day * 18,
            removedAt: now - day * 7,
            subject: 'Old meeting notes',
            body: 'These are the notes from our previous project meeting.',
            isRead: true,
            from: loggedinUser.email,
            to: 'team@example.com',
        }),
        _createMail({
            id: 'm112',
            createdAt: now - day * 25,
            sentAt: now - day * 25,
            removedAt: now - day * 9,
            subject: 'Expired event invitation',
            body: 'The event has already taken place, so this invitation is no longer active.',
            isRead: true,
            from: 'events@example.com',
        }),
    ]

    utilService.saveToStorage(MAIL_KEY, mails)
}

function _createMail(overrides = {}) {
    return {
        id: utilService.makeId(),
        createdAt: Date.now(),
        subject: '',
        body: '',
        isRead: false,
        isStarred: false,
        sentAt: Date.now(),
        removedAt: null,
        from: 'friend@example.com',
        to: loggedinUser.email,
        ...overrides,
    }
}

function _normalizeMail(mail) {
    return {
        ...mail,
        isStarred: Boolean(mail.isStarred),
    }
}
