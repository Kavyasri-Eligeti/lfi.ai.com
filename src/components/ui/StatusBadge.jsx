import { STATUS_META } from '../../content/status';

export default function StatusBadge({ status, className = '' }) {
  const meta = STATUS_META[status];
  if (!meta) return null;
  return (
    <span className={`lf-badge lf-badge--${meta.tone} ${className}`} title={meta.description}>
      {meta.label}
    </span>
  );
}
