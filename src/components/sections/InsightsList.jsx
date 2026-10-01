import SmartLink from '../ui/SmartLink';
import Icon from '../ui/Icon';
import { formatInsightDate, insights } from '../../content/insights';
import Reveal from '../../features/motion/Reveal';

// Verified articles from linkfields.com. Dates only where the site shows one.
export default function InsightsList({ limit = insights.length, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`;
  return (
    <ul className="lf-list-plain lf-insights">
      {insights.slice(0, limit).map((item, i) => (
        <Reveal as="li" key={item.id} index={i} step={0.04}>
          <article className="lf-insight">
            <p className="lf-insight__meta">
              <span className="lf-insight__type">{item.type}</span>
              {item.date ? (
                <time dateTime={item.date}>{formatInsightDate(item.date)}</time>
              ) : (
                item.source && <span>{item.source}</span>
              )}
            </p>
            <Heading className="lf-insight__title">
              <SmartLink href={item.href} className="lf-card__stretch">{item.title}</SmartLink>
            </Heading>
            <Icon name="external" size={18} className="lf-insight__icon" />
          </article>
        </Reveal>
      ))}
    </ul>
  );
}
