// Verification status for every piece of content on the site.
// The UI renders a badge from this table, so an item can never be shown
// without telling the visitor what kind of claim it is.

export const STATUS = {
  CORPORATE: 'corporate',
  PRODUCT: 'product',
  POC: 'poc',
  INTERNAL: 'internal',
  DEMO_SUPPORTED: 'demo-supported',
  PROPOSED: 'proposed',
  TECHNOLOGY: 'technology',
};

export const STATUS_META = {
  [STATUS.CORPORATE]: {
    label: 'Linkfields offering',
    description: 'Published on linkfields.com.',
    tone: 'blue',
  },
  [STATUS.PRODUCT]: {
    label: 'Live demo',
    description: 'A working Linkfields AI demonstration listed in the LFI AI catalogue.',
    tone: 'green',
  },
  [STATUS.POC]: {
    label: 'Proof of concept',
    description: 'Listed as a POC in the LFI AI catalogue.',
    tone: 'neutral',
  },
  [STATUS.INTERNAL]: {
    label: 'Linkfields network only',
    description: 'Depends on a private-network backend and only works inside the Linkfields network.',
    tone: 'neutral',
  },
  [STATUS.DEMO_SUPPORTED]: {
    label: 'Proposed · demo-backed',
    description:
      'Proposed offering, awaiting business approval. An existing Linkfields demo shows the underlying capability.',
    tone: 'orange',
  },
  [STATUS.PROPOSED]: {
    label: 'Proposed · awaiting approval',
    description: 'A proposed opportunity under business review. Not a current Linkfields offering.',
    tone: 'orange',
  },
  [STATUS.TECHNOLOGY]: {
    label: 'AI technology',
    description: 'A general AI technology topic. Not a Linkfields-owned product.',
    tone: 'violet',
  },
};

export const isProposed = (status) =>
  status === STATUS.PROPOSED || status === STATUS.DEMO_SUPPORTED;
