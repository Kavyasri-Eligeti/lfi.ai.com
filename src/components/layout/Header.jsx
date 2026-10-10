import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import LinkfieldsLogo from '../brand/LinkfieldsLogo';
import AILogo from '../brand/AILogo';
import { contactNav, primaryNav } from '../../app/navigation';
import { EASE } from '../../features/motion/tokens';
import './layout.css';
import './header.css';

const navClass = ({ isActive }) => (isActive ? 'is-active' : undefined);

/**
 * Floating header: the Linkfields logo top-left, and a glass pill top-right
 * holding the primary navigation, a line, and Contact. Below 1100px the pill
 * reads MENU ——— CONTACT and MENU opens a full-screen menu.
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const menuButton = useRef(null);
  const sheet = useRef(null);

  useEffect(() => setOpen(false), [location.pathname]);

  // Scrolling down tucks the bars away; scrolling up (or reaching the top)
  // brings them back. A small threshold keeps it from flickering.
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (y < 120) setHidden(false);
      else if (y > lastY + 6) setHidden(true);
      else if (y < lastY - 6) setHidden(false);
      if (Math.abs(y - lastY) > 6 || y < 120) lastY = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  // A new page always shows the bars.
  useEffect(() => setHidden(false), [location.pathname]);

  // Menu: Escape closes it, focus moves into it, the page behind does not scroll.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    document.documentElement.classList.add('lf-menu-open');
    // Content behind the sheet leaves the tab order while the menu is open.
    const behind = [document.getElementById('main'), document.querySelector('.lf-footer')].filter(Boolean);
    behind.forEach((el) => { el.inert = true; });
    sheet.current?.querySelector('a')?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove('lf-menu-open');
      behind.forEach((el) => { el.inert = false; });
    };
  }, [open]);

  return (
    <header className={`lf-header${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}${hidden && !open ? ' is-hidden' : ''}`}>
      <div className="lf-header__inner">
        <Link to="/" className="lf-header__capsule" aria-label="Linkfields AI home">
          <LinkfieldsLogo height={26} light />
          <span className="lf-header__divider" aria-hidden="true" />
          <AILogo size={34} />
        </Link>

        <div className="lf-pill">
          <nav className="lf-nav" aria-label="Primary">
            <ul>
              {primaryNav.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} className={navClass}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <button
            ref={menuButton}
            type="button"
            className="lf-pill__menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
          <span className="lf-pill__line" aria-hidden="true" />
          <Link to={contactNav.to} className="lf-pill__contact">
            {contactNav.label}
          </Link>
          <span className="lf-pill__glow" aria-hidden="true" />
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <m.div
            ref={sheet}
            id="mobile-menu"
            className="lf-sheet"
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE.out }}
          >
            <p className="lf-sheet__label">What are you looking for?</p>
            <nav aria-label="Mobile">
              <ul>
                {[{ label: 'Home', to: '/' }, ...primaryNav, contactNav].map((item, i) => (
                  <m.li
                    key={item.to}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.05 * i, ease: EASE.out }}
                  >
                    <NavLink to={item.to} end={item.to === '/'} className={navClass}>
                      <span className="lf-sheet__arrow" aria-hidden="true">-&gt;</span> {item.label}
                    </NavLink>
                  </m.li>
                ))}
              </ul>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
