import { useId, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import SmartLink from '../ui/SmartLink';
import Icon, { Arrow } from '../ui/Icon';
import { industries } from '../../content/industries';
import { getDemos } from '../../content/demos';
import { EASE } from '../../features/motion/tokens';
import IndustryScene, { hasScene } from './IndustryScene';

// Industry panel art: the published photo, or (where linkfields.com has no
// usable photo) a quiet arrangement of brand modules.
function IndustryArt({ industry }) {
  if (hasScene(industry)) return <IndustryScene industry={industry} />;
  if (industry.image) {
    return <img src={industry.image} alt="" width="480" height="800" loading="lazy" decoding="async" />;
  }
  return (
    <div className="lf-industry-art" aria-hidden="true">
      <i /><i /><i /><i /><i /><i />
    </div>
  );
}

/** Tabbed industries with verified descriptions and the demos filed under each. */
export default function IndustryTabs({ headingLevel = 3 }) {
  const Heading = `h${headingLevel}`;
  const uid = useId();
  const [active, setActive] = useState(industries[0].id);
  const industry = industries.find((i) => i.id === active);
  const related = getDemos(industry.relatedDemos);

  const onKey = (e, i) => {
    const n = industries.length;
    let next = null;
    if (e.key === 'ArrowRight') next = (i + 1) % n;
    if (e.key === 'ArrowLeft') next = (i - 1 + n) % n;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = n - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(industries[next].id);
    document.getElementById(`${uid}-tab-${industries[next].id}`)?.focus();
  };

  return (
    <div className="lf-industry-tabs">
      <div className="lf-tabs" role="tablist" aria-label="Industries">
        {industries.map((ind, i) => (
          <button
            key={ind.id}
            id={`${uid}-tab-${ind.id}`}
            type="button"
            role="tab"
            className="lf-tab"
            aria-selected={ind.id === active}
            aria-controls={`${uid}-panel`}
            tabIndex={ind.id === active ? 0 : -1}
            onClick={() => setActive(ind.id)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {ind.name}
          </button>
        ))}
      </div>

      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${active}`} tabIndex={0} className="lf-industry-panel-host">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={active}
            className="lf-industry-panel"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.26, ease: EASE.out }}
          >
            <div className="lf-industry-panel__media">
              <IndustryArt industry={industry} />
            </div>
            <div className="lf-industry-panel__copy">
              <Heading>{industry.name}</Heading>
              <p className="lf-industry-panel__tagline">{industry.tagline}</p>
              <p>{industry.text}</p>
              {related.length > 0 ? (
                <>
                  <p className="lf-eyebrow">Related demos</p>
                  <ul className="lf-list-plain lf-industry-panel__demos">
                    {related.map((d) => (
                      <li key={d.id}>
                        <SmartLink href={d.href}>
                          {d.name}
                          <Icon name={d.href.startsWith('/') ? 'arrow' : 'external'} size={15} />
                        </SmartLink>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="lf-meta">No catalogue demo is filed under {industry.name} yet. See the corporate page for this industry’s solutions.</p>
              )}
              <SmartLink href={industry.href} className="lf-link">
                {industry.name} on linkfields.com <Arrow />
              </SmartLink>
            </div>
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
