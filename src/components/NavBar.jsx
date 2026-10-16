import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const LINKS = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/computers', label: 'Computers', end: true },
  { to: '/computers/new', label: 'Add Computer' },
  { to: '/about', label: 'About' },
]

export default function NavBar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">▣</span>
          <span>
            AssetHub <small>Computer Asset Manager</small>
          </span>
        </NavLink>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="main-menu"
          onClick={() => setOpen((o) => !o)}
        >
          Menu
        </button>
        <nav id="main-menu" aria-label="Main menu" className={open ? 'open' : ''}>
          <ul>
            {LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.end} onClick={() => setOpen(false)}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
