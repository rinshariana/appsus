const { Link, NavLink, useLocation } = ReactRouterDOM

import { AppNav } from './AppNav.jsx'

export function AppHeader() {
    const { pathname } = useLocation()

    if (pathname === '/mail' || pathname.startsWith('/mail/')) return null

    return (
        <header className="app-header">
            <div className="app-header-inner">
                <Link className="app-brand" to="/" aria-label="Appsus home">
                    <img
                        className="app-brand-mark"
                        src="assets/images/appsus-logo.svg"
                        alt=""
                        aria-hidden="true"
                    />
                    <span className="app-brand-name">Appsus</span>
                </Link>

                <nav className="app-header-primary" aria-label="Primary navigation">
                    <NavLink to="/" end>Home</NavLink>
                    <NavLink to="/about">About</NavLink>
                </nav>

                <AppNav />
            </div>
        </header>
    )
}
