import './OfferCard.css'

const CATEGORY_COLORS = {
  'Surveys':       'blue',
  'Apps & Ads':    'green',
  'Video & Sign-ups': 'yellow',
}

/**
 * OfferCard
 * Displays a single offerwall provider card.
 * On click, opens the provider's iframe in the Offers page.
 *
 * @param {{ offer, onOpen }} props
 */
export default function OfferCard({ offer, onOpen }) {
  const accentColor = CATEGORY_COLORS[offer.category] || 'blue'

  return (
    <div className={`offer-card card offer-card--${accentColor}`}>
      <div className="offer-card__header">
        <div className="offer-card__provider-dot" style={{ background: offer.color }} />
        <span className="offer-card__provider">{offer.name}</span>
        <span className={`badge badge--${accentColor} offer-card__category`}>
          {offer.category}
        </span>
      </div>

      <p className="offer-card__desc">{offer.description}</p>

      <div className="offer-card__meta">
        <div className="offer-card__reward">
          <span className="offer-card__reward-label">Avg. Reward</span>
          <span className="offer-card__reward-value">{offer.avgReward}</span>
        </div>
        <div className={`offer-card__status ${offer.active ? 'offer-card__status--active' : 'offer-card__status--inactive'}`}>
          {offer.active ? '● Live' : '○ Setup required'}
        </div>
      </div>

      <button
        className="btn btn--primary offer-card__btn"
        onClick={() => onOpen(offer)}
        disabled={!offer.active}
      >
        {offer.active ? 'Open Offerwall →' : 'Add API Key'}
      </button>
    </div>
  )
}
