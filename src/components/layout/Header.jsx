import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import LinkfieldsLogo from '../brand/LinkfieldsLogo';
import { contactNav, primaryNav } from '../../app/navigation';
import { EASE } from '../../features/motion/tokens';
import './layout.css';

const navClass = ({ isActive }) => (isActive ? 'is-active' : undefined);

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const menuButton = useRef(null);
  const sheet = useRef(null);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mobile menu: Escape closes it, focus moves into it, the page behind does not scroll.
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
    <header className={`lf-header${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="lf-header__inner">
        <Link to="/" className="lf-header__capsule" aria-label="Linkfields AI home">
          <LinkfieldsLogo height={26} />
          <span className="lf-header__product" aria-hidden="true">AI</span>
        </Link>

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

        <Link to={contactNav.to} className="lf-btn lf-btn--sm lf-header__cta">
          {contactNav.label}
        </Link>

        <button
          ref={menuButton}
          type="button"
          className="lf-menu-button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="lf-menu-button__bars" aria-hidden="true" />
          <span className="lf-visually-hidden">{open ? 'Close menu' : 'Menu'}</span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <m.div
            ref={sheet}
            id="mobile-menu"
            className="lf-sheet"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: EASE.out }}
          >
            <nav aria-label="Mobile">
              <ul>
                {[{ label: 'Home', to: '/' }, ...primaryNav, contactNav].map((item, i) => (
                  <m.li
                    key={item.to}
                    initial={{ y: 10 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.32, delay: 0.03 * i, ease: EASE.out }}
                  >
                    <NavLink to={item.to} end={item.to === '/'} className={navClass}>
                      {item.label}
                      <span className="lf-arrow" aria-hidden="true">→</span>
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
