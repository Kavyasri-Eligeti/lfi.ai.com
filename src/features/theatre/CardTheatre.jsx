import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TheatreStage, { canUseStage, canUseTheatre } from './TheatreStage';
import { getLenis } from '../motion/SmoothScroll';
import { useMotion } from '../motion/MotionProvider';
import { selectCards } from '../../content/theatreCards';
import '../../pages/home/theatre.css';

// Scroll length of the theatre. The run over the cards is short and capped:
// about one wheel notch turns one card, so the whole deck passes in well
// under two screens. As soon as the last card is up, the page's content
// rises over the stage (theatre.css pulls it up by OVERLAP_VH), so there is
// never a blank screen between the cards and the content. The section is the
// run, plus the screen the content takes to rise, plus the sticky exit.
const CARD_VH_MAX = 20; // scroll per card when there are few cards
const CARD_VH_MIN = 7; // never faster than this per card
const RUN_VH_MAX = 140; // the run over all cards
export const OVERLAP_VH = 100; // how far the next section rises over the stage
const runVh = (n) => Math.max(2, n) * Math.max(CARD_VH_MIN, Math.min(CARD_VH_MAX, RUN_VH_MAX / Math.max(1, n)));
const isExternal = (to) => /^(https?:|mailto:|tel:)/.test(to);

function CardLink({ to, className, children, ...rest }) {
  if (isExternal(to)) {
    return (
      <a href={to} className={className} {...rest} {...(to.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {children}
      </a>
    );
  }
  return <Link to={to} className={className} {...rest}>{children}</Link>;
}

/** One card in the DOM deck (phones, reduced motion, no WebGL). */
function DeckCard({ card, index }) {
  return (
    <li className="th-deck__item" style={{ '--a': card.palette[0], '--b': card.palette[1], '--c': card.palette[2], '--i': index }}>
      <CardLink to={card.to} className="th-card">
        {card.image && <img className="th-card__img" src={card.image} alt="" loading="lazy" decoding="async" />}
        <span className="th-card__kicker">{card.kicker}</span>
        {card.code && <span className="th-card__code">{card.code}</span>}
        {card.logos?.length > 0 && (
          <span className="th-card__logos">
            {card.logos.map((l) => (
              <span key={l.name} className={`th-card__logo th-card__logo--sm${l.tile === 'dark' ? ' is-dark' : ''}`}>
                <img src={l.src} alt={l.name} loading="lazy" />
              </span>
            ))}
          </span>
        )}
        {card.logo && (
          <span className="th-card__logo">
            <img src={card.logo} alt="" width="44" height="44" loading="lazy" />
          </span>
        )}
        <span className="th-card__title">{card.title}</span>
        {card.text && <span className="th-card__text">{card.text}</span>}
        <span className="th-card__go" aria-hidden="true">Explore -&gt;</span>
      </CardLink>
    </li>
  );
}

/**
 * The card theatre used on every page: glass cards spiralling around the
 * iridescent data spine as the page scrolls, with the "What are you looking
 * for?" filters and "Ask me anything". On the homepage (`withHero`, with the
 * hero section in `before`) the spine and cards are on from the first frame
 * as the DNA hero, cycling by themselves until this section scrolls in;
 * elsewhere they rise as the section scrolls in. Phones, reduced motion and
 * browsers without WebGL get the same cards as a deck (phones still get the
 * DNA hero, in a lighter form). `onStage` reports whether the WebGL stage
 * is live.
 */
export default function CardTheatre({
  id = 'work',
  cards: all,
  featured,
  filters = [],
  title = 'What are you looking for?',
  label,
  ask = true,
  withMark = false,
  withHero = false,
  before,
  onModeChange,
  onStage,
}) {
  const navigate = useNavigate();
  const { reduced } = useMotion();
  const work = useRef(null);
  const engine = useRef(null);
  const [filter, setFilter] = useState('');
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState(() => (!reduced && canUseTheatre() ? 'theatre' : 'deck'));
  // Phones: the DNA hero plays on the stage while this section is the deck.
  const [heroOnly] = useState(() => withHero && !reduced && !canUseTheatre() && canUseStage({ phones: true }));

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(query), 250);
    return () => window.clearTimeout(t);
  }, [query]);
  useEffect(() => { onModeChange?.(mode); }, [mode, onModeChange]);

  const cards = useMemo(() => selectCards(all, { filter, query: debounced }, featured || all), [all, featured, filter, debounced]);

  // The engine reads its timeline from the sections: the page's own (the
  // homepage hero; or the legacy intro and statement) where given, and this
  // work section.
  const sections = useMemo(
    () => ({ get current() { return { hero: before?.hero?.current, intro: before?.intro?.current, statement: before?.statement?.current, work: work.current }; } }),
    [before]
  );

  useEffect(() => { engine.current?.setCards(cards); }, [cards]);
  const onEngine = useCallback(
    (e) => {
      engine.current = e;
      onStage?.(Boolean(e));
      if (e) {
        e.setCards(cards);
        if (!heroOnly) setMode('theatre');
      }
    },
    // The first set is applied here; later sets by the effect above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const open = useCallback(
    (card) => {
      if (isExternal(card.to)) {
        if (card.to.startsWith('http')) window.open(card.to, '_blank', 'noopener,noreferrer');
        else window.location.href = card.to;
      } else navigate(card.to);
    },
    [navigate]
  );

  const scrollToCard = useCallback(
    (i) => {
      const el = work.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const span = (runVh(cards.length) / 100) * window.innerHeight;
      const fraction = engine.current?.fractionFor?.(i) ?? (cards.length > 1 ? i / (cards.length - 1) : 0);
      const y = top + fraction * span + 2;
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(y, { duration: 1.4 });
      else window.scrollTo({ top: y });
    },
    [cards.length]
  );

  const choose = (fid) => {
    setQuery('');
    setDebounced('');
    setFilter((f) => (f === fid ? '' : fid));
    if (mode === 'theatre') window.setTimeout(() => scrollToCard(0), 60);
  };

  const submit = (e) => {
    e.preventDefault();
    if (cards[0] && debounced) open(cards[0]);
  };

  const theatre = mode === 'theatre';
  const current = cards[Math.min(active, cards.length - 1)];
  const titleId = `${id}-title`;

  return (
    <>
      <TheatreStage
        sections={sections}
        withMark={withMark}
        withHero={withHero}
        heroOnly={heroOnly}
        onEngine={onEngine}
        onActive={setActive}
        onSelect={open}
        onFail={() => setMode('deck')}
      />
      <section
        ref={work}
        id={id}
        className={`th-work${theatre ? '' : ' th-work--deck'}`}
        style={theatre ? { height: `${runVh(cards.length) + OVERLAP_VH + 100}vh` } : undefined}
        data-run={theatre ? runVh(cards.length) : undefined}
        aria-labelledby={titleId}
      >
        <div className={theatre ? 'th-sticky' : 'th-work__deck-wrap'}>
          <div className="th-panel">
            <h2 id={titleId} className="th-panel__title">{title}</h2>
            {filters.length > 0 && (
              <ul className="lf-list-plain th-filters">
                {filters.map((f) => (
                  <li key={f.id}>
                    <button type="button" className="th-filter" aria-pressed={filter === f.id} onClick={() => choose(f.id)}>
                      <span aria-hidden="true">-&gt;</span> {f.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {ask && (
              <form className="th-ask" role="search" onSubmit={submit}>
                <label htmlFor={`${id}-ask`} className="lf-visually-hidden">Ask me anything</label>
                <input
                  id={`${id}-ask`}
                  type="search"
                  placeholder="Ask me anything..."
                  autoComplete="off"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (filter) setFilter('');
                  }}
                />
              </form>
            )}
            <p className="th-panel__status" role="status" aria-live="polite">
              {debounced && !cards.length ? 'No match. Try another word.' : `${cards.length} ${cards.length === 1 ? 'card' : 'cards'}`}
            </p>
          </div>

          {theatre && current && (
            <p className="th-caption" aria-hidden="true">
              <span className="th-caption__num">{String(active + 1).padStart(2, '0')} / {String(cards.length).padStart(2, '0')}</span>
              <span className="th-caption__line" />
              <span>{current.kicker}</span>
            </p>
          )}

          {/* In the theatre these links are the cards' keyboard and screen-reader
              path: focusing one turns its card to the front. Otherwise they are the deck. */}
          <ul className={`lf-list-plain ${theatre ? 'th-cards-a11y' : 'th-deck'}`} aria-label={label}>
            {theatre
              ? cards.map((card, i) => (
                  <li key={card.id}>
                    <CardLink to={card.to} onFocus={() => scrollToCard(i)}>
                      {card.title}, {card.kicker}
                    </CardLink>
                  </li>
                ))
              : cards.map((card, i) => <DeckCard key={card.id} card={card} index={i} />)}
          </ul>
        </div>
      </section>
    </>
  );
}
