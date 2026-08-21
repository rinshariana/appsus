const { NavLink } = ReactRouterDOM

export function AppNav() {
    return (
        <nav className="apps-navigation" aria-label="Appsus applications">
            <NavLink to="/" end aria-label="Appsus home" title="Appsus home">
                <i className="fa-solid fa-grip" aria-hidden="true" />
            </NavLink>
            <NavLink to="/mail" aria-label="Mail" title="Mail">
                <i className="fa-regular fa-envelope" aria-hidden="true" />
            </NavLink>
            <NavLink to="/note" aria-label="Notes" title="Notes">
                <i className="fa-regular fa-note-sticky" aria-hidden="true" />
            </NavLink>
        </nav>
    )
}
