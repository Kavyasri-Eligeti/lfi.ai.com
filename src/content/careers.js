// Careers content. Source: https://www.linkfields.com/careers (verbatim).
// No vacancies or benefits are published there, so none are shown here.

// Photos are the ones published on linkfields.com/careers, from the original
// full-resolution files. Each comes in three widths (640, 1280 and HD 2560;
// `width`/`height` are the largest file's true size), so every screen loads
// only the size it needs and large or high-density screens get HD.
const photo = (name, width, height, alt, caption) => ({
  src: `/images/careers/${name}-1280.webp`,
  srcSet: `/images/careers/${name}-640.webp 640w, /images/careers/${name}-1280.webp 1280w, /images/careers/${name}-2560.webp ${width}w`,
  hd: `/images/careers/${name}-2560.webp`,
  width,
  height,
  alt,
  caption,
});

const office = photo('office', 2316, 1644, 'Reception area of a Linkfields office, with the Linkfields logo on a slatted wooden wall and a yellow sofa', 'The Linkfields reception');
const team = photo('team', 2560, 1469, 'Colleagues gathered around a laptop in a meeting room', 'Working it through together');
const meeting = photo('meeting', 2560, 1440, 'A team meeting around a table, with charts on a screen', 'Sharing the numbers');

export const careers = {
  images: { office, team, meeting },
  // Every photo from the careers page, for the gallery.
  gallery: [
    office,
    photo('floor', 2560, 1595, 'An open-plan office floor with rows of colleagues at their desks', 'Room to focus'),
    team,
    photo('celebrate', 2560, 1595, 'Colleagues at a desk sharing a high five', 'Celebrating the wins'),
    photo('workspace', 2560, 1641, 'A bright, modern open-plan workspace with white desks', 'A modern workspace'),
    meeting,
    photo('collaborate', 2560, 1593, 'Colleagues working at a table with laptops and notebooks', 'Ideas on the table'),
    photo('thinking', 2560, 1595, 'Three colleagues working together at a table by a window', 'A thinking-space'),
    photo('holidays', 2560, 1707, 'Colleagues in festive hats taking a group selfie', 'Celebrating the season'),
  ],
  eyebrow: 'Life at Linkfields',
  title: 'Be part of a world-leading innovative team',
  subtitle: 'A place for great minds',
  intro:
    'If you consider yourself a thinker and an innovator, Linkfields will provide you the ideal workplace that enables a free flow of creativity.',
  thinkingSpace: {
    title: 'Not just a workplace, it’s a "thinking-space"',
    text: 'We offer you an environment where every employee is encouraged to express, invent, and do what they love. The employees boost the business’ growth, the business boosts theirs.',
  },
  empower: 'At Linkfields, we ensure to empower our employees.',
  nurtureTitle: 'We Nurture: Qualities that make us human',
  nurture: [
    'Honesty & integrity',
    'Agility',
    'Team spirit',
    'Emotional intelligence',
    'Work-life wellbeing',
    // Spelled "Craftmenship" on linkfields.com; corrected here.
    'Craftsmanship',
  ],
  cta: {
    title: 'Interested in taking your career to next level?',
    jobsLabel: 'Find jobs',
    text: 'Become a part of our work community that is responsible for fuelling innovation across the globe',
    jobsHref: 'https://www.ditto.jobs/company-profile?id=987835090',
  },
};
