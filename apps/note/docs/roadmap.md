# MissKeep Roadmap

## 1. Foundation
- [x] Create initial demo notes
- [x] Implement `noteService.query()`
- [x] Load notes in `NoteIndex`
- [x] Render notes through `NoteList`
- [x] Render individual notes through `NotePreview`
- [x] Load notes from `localStorage`

## 2. First Complete Slice: Text Notes
- [ ] Create `NoteTxt`
- [ ] Implement dynamic rendering from `NotePreview`
- [ ] Style note cards close to Google Keep
- [ ] Add basic pinned/unpinned structure
- [ ] Add basic responsive note layout

## 3. CRUD for Text Notes
- [ ] Add text note
- [ ] Delete note
- [ ] Edit note with controlled inputs
- [ ] Save notes through `noteService`
- [ ] Add success/error messages
- [ ] Style controls as they are implemented

## 4. Core Note Actions
- [ ] Change background color
- [ ] Pin / unpin
- [ ] Duplicate note
- [ ] Filter by search
- [ ] Filter by note type
- [ ] Continue polishing layout and interactions

## 5. Required Note Types
- [ ] `NoteImg`
- [ ] `NoteVideo`
- [ ] `NoteTodos`
- [ ] Make each type functional before moving on
- [ ] Style each type close to Google Keep

## 6. Responsive / Mobile
- [ ] Match desktop layout closely to Google Keep
- [ ] Implement mobile layout based on the mobile app
- [ ] Avoid simply shrinking the desktop version
- [ ] Adjust header/navigation for small screens
- [ ] Test card layout on multiple screen sizes

## 7. Keep ↔ Mail Integration
- [ ] Define query-param contract with partner
- [ ] Send note content to Mail compose
- [ ] Support Mail → Keep integration
- [ ] Test both directions

## 8. Final Polish
- [ ] Extract reusable CSS variables for colors, sizes, spacing, etc.
- [ ] Finalize icons
- [ ] Add hover/focus states
- [ ] Handle loading states
- [ ] Handle empty states
- [ ] Handle error states
- [ ] Improve demo data
- [ ] Review responsive behavior
- [ ] Integration testing
- [ ] GitHub Pages deployment