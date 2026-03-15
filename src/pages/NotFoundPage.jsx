import { useNavigate } from 'react-router-dom'
import './NotFoundPage.css'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="not-found">
      <div className="not-found__code mono">404</div>
      <h1 className="not-found__title">Page not found</h1>
      <p className="not-found__desc">This page doesn't exist in EarnHub.</p>
      <button className="btn btn--primary" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>
    </div>
  )
}
