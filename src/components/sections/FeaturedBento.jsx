import DemoCard from '../ui/DemoCard';
import { featuredDemoIds } from '../../content/capabilities';
import { getDemos } from '../../content/demos';
import Reveal from '../../features/motion/Reveal';

// Asymmetric bento of flagship demos. The first is the large charcoal module;
// tile size follows the editorial order, not a status ranking.
export default function FeaturedBento({ headingLevel = 3 }) {
  const items = getDemos(featuredDemoIds);
  return (
    <ul className="lf-list-plain lf-bento">
      {items.map((demo, i) => (
        <Reveal as="li" key={demo.id} className={`lf-bento__cell lf-bento__cell--${i}`} index={i}>
          <DemoCard demo={demo} headingLevel={headingLevel} variant={i === 0 ? 'feature' : 'default'} />
        </Reveal>
      ))}
    </ul>
  );
}
