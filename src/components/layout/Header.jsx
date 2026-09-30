import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import LinkfieldsLogo from '../brand/LinkfieldsLogo';
import { primaryNav } from '../../app/navigation';
import { useMotion } from '../../features/motion/MotionProvider';
import './layout.css';

export default function Header() {
  const [open, setOpen] = useState(false);
  const { reduced, setPreference } = useMotion();
  const location = useLocation();
  const menuButton = useRef(null);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="lf-header">
      <div className="lf-header__inner">
        <Link to="/" className="lf-header__brand" aria-label="Linkfields AI home">
          <LinkfieldsLogo height={30} />
          <span className="lf-header__product" aria-hidden="true">AI</span>
        </Link>

        <nav className={`lf-nav${open ? ' is-open' : ''}`} aria-label="Primary" id="primary-nav">
          <ul>
            {primaryNav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    isActive || (item.to === '/' && location.pathname.startsWith('/universe/')) ? 'is-active' : undefined
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lf-header__tools">
          <button
            type="button"
            className="lf-motion-toggle"
            aria-pressed={reduced}
            onClick={() => setPreference(reduced ? 'full' : 'reduced')}
            title={reduced ? 'Motion is reduced and 3D is off. Select to turn full motion back on.' : 'Reduce motion and turn off the 3D animation'}
          >
            <span aria-hidden="true" className="lf-motion-toggle__icon" />
            <span className="lf-motion-toggle__text">Reduce motion</span>
          </button>
          <button
            ref={menuButton}
            type="button"
            className="lf-menu-button"
            aria-expanded={open}
            aria-controls="primary-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="lf-menu-button__bars" aria-hidden="true" />
            <span className="lf-visually-hidden">Menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
