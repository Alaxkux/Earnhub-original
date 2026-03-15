import { useState, useEffect } from 'react'
import { useOffers }          from '../hooks/useOffers'
import { useEarnings }        from '../hooks/useEarnings'
import { useNotifications }   from '../hooks/useNotifications'
import OfferCard              from '../components/offers/OfferCard'
import { listenForCPXCompletion }      from '../services/cpxResearch'
import { listenForAdGateCompletion }   from '../services/adGate'
import { listenForOfferToroCompletion } from '../services/offerToro'
import './OffersPage.css'

export default function OffersPage() {
  const { offers, loading } = useOffers()
  const { logTask }         = useEarnings()
  const { addNotification } = useNotifications()

  // Currently open offerwall
  const [activeOffer, setActiveOffer] = useState(null)

  // Listen for completions from all providers
  useEffect(() => {
    function handleComplete(task) {
      logTask(task)
      addNotification({
        title:   `Task completed: ${task.title}`,
        message: `+$${task.reward.toFixed(2)} from ${task.provider}`,
        type:    'success',
      })
    }

    const cleanups = [
      listenForCPXCompletion(handleComplete),
      listenForAdGateCompletion(handleComplete),
      listenForOfferToroCompletion(handleComplete),
    ]
    return () => cleanups.forEach(fn => fn())
  }, [])

  return (
    <div className="offers-page">
      <div className="page-header">
        <h1>Offers</h1>
        <p>Select a provider to browse available tasks.</p>
      </div>

      {/* Provider cards */}
      {!activeOffer && (
        <div className="grid-3 offers-page__grid">
          {loading
            ? [1, 2, 3].map(i => <div key={i} className="skeleton offers-page__skeleton" />)
            : offers.map((offer, i) => (
                <div key={offer.id} style={{ animationDelay: `${i * 0.08}s` }}>
                  <OfferCard offer={offer} onOpen={setActiveOffer} />
                </div>
              ))
          }
        </div>
      )}

      {/* Iframe viewer */}
      {activeOffer && (
        <div className="offers-page__viewer">
          <div className="offers-page__viewer-header">
            <div className="offers-page__viewer-title">
              <div className="offers-page__viewer-dot" style={{ background: activeOffer.color }} />
              {activeOffer.name}
            </div>
            <button
              className="btn btn--ghost offers-page__close"
              onClick={() => setActiveOffer(null)}
            >
              ← Back to Providers
            </button>
          </div>

          <div className="offers-page__iframe-wrap">
            {activeOffer.iframeURL ? (
              <iframe
                src={activeOffer.iframeURL}
                title={activeOffer.name}
                className="offers-page__iframe"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
                allowFullScreen
              />
            ) : (
              <div className="offers-page__no-url">
                <p>No iframe URL available.</p>
                <p>Check your <code>.env</code> file and make sure the API key is set.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
