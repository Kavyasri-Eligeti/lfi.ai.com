import Reveal from '../../features/motion/Reveal';

/**
 * Section heading block. `split` puts the heading and the supporting text side
 * by side on wide screens (editorial layout).
 */
export default function SectionHeader({ eyebrow, title, children, id, as: Heading = 'h2', split = false, aside }) {
  const body = children && (typeof children === 'string' ? <p>{children}</p> : children);
  if (split) {
    return (
      <Reveal as="header" className="lf-section-header lf-section-header--split">
        <div>
          {eyebrow && <p className="lf-eyebrow">{eyebrow}</p>}
          <Heading id={id}>{title}</Heading>
        </div>
        <div>
          {body}
          {aside}
        </div>
      </Reveal>
    );
  }
  return (
    <Reveal as="header" className="lf-section-header">
      {eyebrow && <p className="lf-eyebrow">{eyebrow}</p>}
      <Heading id={id}>{title}</Heading>
      {body}
      {aside}
    </Reveal>
  );
}
