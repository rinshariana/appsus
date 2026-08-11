import { utilService } from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'

const NOTE_KEY = 'noteDB'
_createNotes()

export const noteService = {
    query,
}


function query() {
    return storageService.query(NOTE_KEY)
}

function _createNotes() {
    let notes = utilService.loadFromStorage(NOTE_KEY)

     if (!notes || !notes.length) {
        notes = [
            {
                id: 'n101',
                createdAt: 1112222,
                type: 'NoteTxt',
                isPinned: true,
                style: {
                    backgroundColor: '#00d'
                },
                info: {
                    txt: 'Fullstack Me Baby!'
                }
            },
            {
                id: 'n102',
                createdAt: 1112223,
                type: 'NoteImg',
                isPinned: false,
                style: {
                    backgroundColor: '#0d0'
                },
                info: {
                    url: 'http://some-img/me',
                    title: 'Bobi and Me'
                }
            },
            {
                id: 'n103',
                createdAt: 1112224,
                type: 'NoteTodos',
                isPinned: false,
                style: {
                    backgroundColor: '#d00'
                },
                info: {
                    title: 'Get my stuff together',
                    todos: [
                        { txt: 'Driving license', isDone: true },
                        { txt: 'Coding power', isDone: false }
                    ]
                }
            }
        ]

        utilService.saveToStorage(NOTE_KEY, notes)
    }
}