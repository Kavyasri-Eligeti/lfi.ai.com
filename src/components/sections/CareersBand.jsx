import { m } from 'framer-motion';
import { Link } from 'react-router-dom';
import SmartLink from '../ui/SmartLink';
import { Arrow } from '../ui/Icon';
import { careers } from '../../content/careers';
import Reveal from '../../features/motion/Reveal';

// Recruitment invitation: editorial type beside the Linkfields office photo.
export default function CareersBand({ headingLevel = 2, id }) {
  const Heading = `h${headingLevel}`;
  const img = careers.images.office;
  return (
    <div className="lf-careers-band">
      <Reveal as="div" className="lf-careers-band__copy">
        <p className="lf-eyebrow">{careers.eyebrow}</p>
        <Heading id={id}>{careers.title}</Heading>
        <p className="lf-lead">{careers.intro}</p>
        <div className="lf-actions">
          <SmartLink href={careers.cta.jobsHref} className="lf-btn lf-btn--yellow">
            {careers.cta.jobsLabel} <Arrow />
          </SmartLink>
          <Link to="/careers" className="lf-btn lf-btn--secondary">Life at Linkfields</Link>
        </div>
      </Reveal>
      <m.figure
        className="lf-careers-band__media"
        initial={{ clipPath: 'inset(0% 0% 12% 0% round 6px 6px 48px 6px)' }}
        whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 6px 6px 48px 6px)' }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 0.9, ease: [0.22, 0.8, 0.24, 1] }}
      >
        <img
          src={img.src}
          srcSet={`${img.srcSm} 800w, ${img.src} 1600w`}
          sizes="(max-width: 860px) 100vw, 50vw"
          width={img.width}
          height={img.height}
          alt={img.alt}
          loading="lazy"
          decoding="async"
        />
      </m.figure>
    </div>
  );
}
