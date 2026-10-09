/**
 * An illustrative Linkfields AI workspace, drawn in HTML so it stays crisp at
 * any zoom. Demo names are the live LFI AI catalogue; the question, answer,
 * documents and agent runs are examples. Decorative.
 */
import { IconArrowUpRight, IconCheck, IconSparkle } from './icons';

const NAV = ['Home', 'Assistants', 'Agents', 'Knowledge', 'Automations', 'Analytics', 'Demos'];

export function ConsoleChat({ compact = false }) {
  return (
    <div className={`cx-card cx-chat${compact ? ' is-compact' : ''}`}>
      <div className="cx-card__head">
        <span className="cx-card__title">Policy assistant</span>
        <span className="cx-pill">RAG · grounded</span>
      </div>
      <div className="cx-msg cx-msg--user">What changed in the claims policy this quarter?</div>
      <div className="cx-msg cx-msg--ai">
        <span className="cx-ai-mark"><IconSparkle /></span>
        <div>
          <p>Three changes affect claims handling:</p>
          <ul>
            <li>Approval threshold for desk claims raised <span className="cx-cite">1</span></li>
            <li>New document checklist for property claims <span className="cx-cite">2</span></li>
            <li>Escalation to fraud review within one day <span className="cx-cite">1</span></li>
          </ul>
          <div className="cx-sources">
            <span className="cx-source"><b>1</b> Claims Policy v4.pdf</span>
            <span className="cx-source"><b>2</b> Property Claims Guide.docx</span>
          </div>
        </div>
      </div>
      {!compact && (
        <div className="cx-input">
          <span>Ask about policies, contracts or procedures…</span>
          <span className="cx-send" aria-hidden="true">↑</span>
        </div>
      )}
    </div>
  );
}

export function ConsoleAgents() {
  const runs = [
    { name: 'Invoice triage', step: 'Awaiting your approval', state: 'wait' },
    { name: 'KYC document check', step: 'Completed · 3 documents', state: 'done' },
    { name: 'Contract summary', step: 'Drafting', state: 'run' },
  ];
  return (
    <div className="cx-card cx-agents">
      <div className="cx-card__head">
        <span className="cx-card__title">Agent runs</span>
        <span className="cx-muted">Today</span>
      </div>
      <ul>
        {runs.map((r) => (
          <li key={r.name} className={`cx-run cx-run--${r.state}`}>
            <span className="cx-run__icon">{r.state === 'done' ? <IconCheck /> : r.state === 'wait' ? '!' : <span className="cx-spin" />}</span>
            <span className="cx-run__name">{r.name}</span>
            <span className="cx-run__step">{r.step}</span>
          </li>
        ))}
      </ul>
      <div className="cx-approve">
        <span>Invoice triage needs a decision</span>
        <span className="cx-btn">Review</span>
      </div>
    </div>
  );
}

export function ConsoleForecast() {
  return (
    <div className="cx-card cx-forecast">
      <div className="cx-card__head">
        <span className="cx-card__title">Demand forecast</span>
        <span className="cx-muted">Sample data</span>
      </div>
      <svg viewBox="0 0 300 110" className="cx-chart" aria-hidden="true">
        <defs>
          <linearGradient id="cxband" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#5266eb" stopOpacity="0.35" />
            <stop offset="1" stopColor="#5266eb" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 80 C30 74 50 86 80 70 S130 60 160 58 L160 110 L0 110 Z" fill="url(#cxband)" opacity="0.6" />
        <path d="M0 80 C30 74 50 86 80 70 S130 60 160 58" fill="none" stroke="#ededf3" strokeWidth="1.6" />
        <path d="M160 58 C190 50 220 44 250 36 S290 28 300 24 L300 52 C280 58 250 66 220 70 S180 72 160 66 Z" fill="#5266eb" opacity="0.18" />
        <path className="cx-forecast-line" d="M160 58 C190 50 220 44 250 36 S290 28 300 24" fill="none" stroke="#8b98ff" strokeWidth="1.8" strokeDasharray="4 4" />
        <line x1="160" x2="160" y1="10" y2="110" stroke="#ededf3" strokeOpacity="0.25" strokeDasharray="2 3" />
      </svg>
      <div className="cx-legend"><span><i className="cx-dot" />Actual</span><span><i className="cx-dot cx-dot--accent" />Forecast</span></div>
    </div>
  );
}

export function ConsoleDocs() {
  const fields = [
    ['Supplier', 'Northwind Supplies'],
    ['Invoice no.', 'INV-20481'],
    ['Due date', '30 days'],
    ['Category', 'Office equipment'],
  ];
  return (
    <div className="cx-card cx-docs">
      <div className="cx-card__head">
        <span className="cx-card__title">Document extraction</span>
        <span className="cx-pill">TextIQ</span>
      </div>
      <div className="cx-docs__grid">
        <div className="cx-page" aria-hidden="true">
          {Array.from({ length: 9 }, (_, i) => <i key={i} style={{ width: `${[80, 60, 90, 40, 70, 85, 55, 75, 30][i]}%` }} />)}
        </div>
        <ul className="cx-fields">
          {fields.map(([k, v], i) => (
            <li key={k} style={{ '--i': i }}>
              <span>{k}</span>
              <b>{v}</b>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ConsoleDemos() {
  const demos = ['TextIQ', 'RAG Chatbot', 'vajraX', 'EduPilot', 'Unmanned Kiosk'];
  return (
    <div className="cx-card cx-demos">
      <div className="cx-card__head">
        <span className="cx-card__title">Live demos</span>
        <span className="cx-muted">LFI AI catalogue</span>
      </div>
      <ul>
        {demos.map((d) => (
          <li key={d}><span className="cx-live" />{d}<IconArrowUpRight className="cx-go" /></li>
        ))}
      </ul>
    </div>
  );
}

/** The whole workspace window. */
export default function Console() {
  return (
    <div className="cx" aria-hidden="true">
      <div className="cx-chrome">
        <span /><span /><span />
        <div className="cx-url">ai.linkfields.com</div>
      </div>
      <div className="cx-body">
        <aside className="cx-side">
          <div className="cx-org">
            <img src="/brand/linkfields-mark.svg" alt="" width="18" height="20" />
            <span>Linkfields AI</span>
          </div>
          <ul>
            {NAV.map((n, i) => (
              <li key={n} className={i === 0 ? 'is-on' : ''}>{n}</li>
            ))}
          </ul>
        </aside>
        <div className="cx-main">
          <div className="cx-top">
            <div className="cx-search">Ask Linkfields AI anything</div>
            <span className="cx-btn cx-btn--accent">New assistant</span>
          </div>
          <h4 className="cx-hello">Welcome back</h4>
          <div className="cx-grid">
            <ConsoleChat />
            <div className="cx-stack">
              <ConsoleAgents />
              <ConsoleForecast />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
