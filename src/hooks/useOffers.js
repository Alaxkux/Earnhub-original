import { useEffect } from 'react'
import { useEarnHub, ACTIONS } from '../context/EarnHubContext'
import { getCPXOfferwallURL, CPX_PROVIDER } from '../services/cpxResearch'
import { getAdGateOfferwallURL, ADGATE_PROVIDER } from '../services/adGate'
import { getOfferToroOfferwallURL, OFFERTORO_PROVIDER } from '../services/offerToro'

export function useOffers() {
  const { state, dispatch } = useEarnHub()
  const user = state.user   // ← grab the logged-in user

  useEffect(() => {
    if (!user?._id) return  // ← wait until user is loaded

    dispatch({ type: ACTIONS.SET_OFFERS_LOADING, payload: true })

    const providers = [
      {
        id:          'cpx',
        name:        CPX_PROVIDER,
        description: 'Surveys, market research, and opinion polls.',
        color:       '#2563EB',
        iframeURL:   getCPXOfferwallURL(user._id),  // ← pass real user ID
        avgReward:   '$1.50 – $3.00',
        category:    'Surveys',
        active:      !!import.meta.env.VITE_CPX_APP_ID,
      },
      {
        id:          'adgate',
        name:        ADGATE_PROVIDER,
        description: 'App installs, video ads, and mobile games.',
        color:       '#10B981',
        iframeURL:   getAdGateOfferwallURL(user._id),
        avgReward:   '$0.10 – $5.00',
        category:    'Apps & Ads',
        active:      !!import.meta.env.VITE_ADGATE_APP_ID,
      },
      {
        id:          'offertoro',
        name:        OFFERTORO_PROVIDER,
        description: 'Videos, sign-ups, and promotional offers.',
        color:       '#F59E0B',
        iframeURL:   getOfferToroOfferwallURL(user._id),
        avgReward:   '$0.05 – $2.00',
        category:    'Video & Sign-ups',
        active:      !!import.meta.env.VITE_OFFERTORO_APP_ID,
      },
    ]

    dispatch({ type: ACTIONS.SET_OFFERS, payload: providers })
  }, [user?._id])  // ← re-run when user loads

  return {
    offers:  state.offers,
    loading: state.offersLoading,
    error:   state.offersError,
  }
}