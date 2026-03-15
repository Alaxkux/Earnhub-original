import { useState }   from 'react'
import { useEarnings } from '../hooks/useEarnings'
import { useAuth }     from '../context/AuthContext'
import { userAPI }     from '../services/api'
import './SettingsPage.css'

export default function SettingsPage() {
  const { dailyGoal, setDailyGoalTarget } = useEarnings()
  const { user, updateUser, logout }      = useAuth()

  // Goal
  const [goalInput, setGoalInput] = useState(dailyGoal.target.toFixed(2))
  const [goalSaved, setGoalSaved] = useState(false)
  const [goalError, setGoalError] = useState('')

  // Profile
  const [nameInput,        setNameInput]        = useState(user?.name || '')
  const [currentPassword,  setCurrentPassword]  = useState('')
  const [newPassword,      setNewPassword]      = useState('')
  const [profileSaved,     setProfileSaved]     = useState(false)
  const [profileError,     setProfileError]     = useState('')
  const [profileLoading,   setProfileLoading]   = useState(false)

  async function handleGoalSave() {
    const val = parseFloat(goalInput)
    if (isNaN(val) || val <= 0) {
      setGoalError('Please enter a valid amount greater than $0.')
      return
    }
    setGoalError('')
    try {
      await setDailyGoalTarget(val)
      setGoalSaved(true)
      setTimeout(() => setGoalSaved(false), 2500)
    } catch (err) {
      setGoalError(err.message || 'Failed to save goal')
    }
  }

  async function handleProfileSave() {
    setProfileError('')
    if (newPassword && newPassword.length < 6) {
      setProfileError('New password must be at least 6 characters')
      return
    }
    setProfileLoading(true)
    try {
      const { user: updated } = await userAPI.updateProfile(
        nameInput.trim(),
        currentPassword || undefined,
        newPassword     || undefined
      )
      updateUser(updated)
      setCurrentPassword('')
      setNewPassword('')
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 2500)
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile')
    } finally {
      setProfileLoading(false)
    }
  }

  function handleClearData() {
    if (window.confirm('Sign out and clear all local data?')) {
      logout()
    }
  }

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your account and preferences.</p>
      </div>

      {/* Account info */}
      <section className="settings-section card">
        <h2 className="settings-section__title">Account</h2>
        <div className="settings-row">
          <div className="settings-row__info">
            <label className="settings-row__label">Email</label>
            <p className="settings-row__desc">Your login email address.</p>
          </div>
          <code className="settings-row__value">{user?.email || '—'}</code>
        </div>
        <div className="settings-row">
          <div className="settings-row__info">
            <label className="settings-row__label">User ID</label>
            <p className="settings-row__desc">Passed to offerwall providers.</p>
          </div>
          <code className="settings-row__value">
            {import.meta.env.VITE_APP_USER_ID || 'Not set in .env'}
          </code>
        </div>
      </section>

      {/* Profile update */}
      <section className="settings-section card">
        <h2 className="settings-section__title">Profile</h2>
        {profileError && <div className="settings-error">{profileError}</div>}
        <div className="settings-row">
          <div className="settings-row__info">
            <label className="settings-row__label" htmlFor="name-input">Name</label>
          </div>
          <input
            id="name-input"
            type="text"
            className="settings-input"
            style={{ width: '180px' }}
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
          />
        </div>
        <div className="settings-row">
          <div className="settings-row__info">
            <label className="settings-row__label" htmlFor="curr-pass">Current Password</label>
            <p className="settings-row__desc">Required only if changing password.</p>
          </div>
          <input
            id="curr-pass"
            type="password"
            className="settings-input"
            style={{ width: '180px' }}
            placeholder="••••••••"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="settings-row">
          <div className="settings-row__info">
            <label className="settings-row__label" htmlFor="new-pass">New Password</label>
          </div>
          <input
            id="new-pass"
            type="password"
            className="settings-input"
            style={{ width: '180px' }}
            placeholder="Leave blank to keep"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
        </div>
        <div className="settings-section__footer">
          <button className="btn btn--primary" onClick={handleProfileSave} disabled={profileLoading}>
            {profileLoading ? 'Saving...' : profileSaved ? '✓ Saved' : 'Save Profile'}
          </button>
        </div>
      </section>

      {/* Daily goal */}
      <section className="settings-section card">
        <h2 className="settings-section__title">Earning Goals</h2>
        <div className="settings-row">
          <div className="settings-row__info">
            <label className="settings-row__label" htmlFor="daily-goal">Daily Goal ($)</label>
            <p className="settings-row__desc">Target amount to earn each day.</p>
          </div>
          <div className="settings-row__control">
            <input
              id="daily-goal"
              type="number"
              min="0.01"
              step="0.50"
              value={goalInput}
              onChange={e => { setGoalInput(e.target.value); setGoalError('') }}
              className={`settings-input ${goalError ? 'settings-input--error' : ''}`}
            />
            {goalError && <p className="settings-input__error">{goalError}</p>}
          </div>
        </div>
        <div className="settings-section__footer">
          <button className="btn btn--primary" onClick={handleGoalSave}>
            {goalSaved ? '✓ Saved' : 'Save Goal'}
          </button>
        </div>
      </section>

      {/* Provider keys */}
      <section className="settings-section card">
        <h2 className="settings-section__title">Provider API Keys</h2>
        <p className="settings-section__note">
          API keys are configured via your <code>.env</code> file. Restart the dev server after changes.
        </p>
        {[
          { label: 'CPX Research App ID',  key: 'VITE_CPX_APP_ID' },
          { label: 'AdGate Media App ID',  key: 'VITE_ADGATE_APP_ID' },
          { label: 'OfferToro App ID',     key: 'VITE_OFFERTORO_APP_ID' },
        ].map(({ label, key }) => {
          const val = import.meta.env[key]
          return (
            <div key={key} className="settings-row">
              <div className="settings-row__info">
                <label className="settings-row__label">{label}</label>
                <code className="settings-row__env-key">{key}</code>
              </div>
              <span className={`badge ${val ? 'badge--green' : 'badge--red'}`}>
                {val ? '● Set' : '○ Missing'}
              </span>
            </div>
          )
        })}
      </section>

      {/* Danger zone */}
      <section className="settings-section settings-section--danger card">
        <h2 className="settings-section__title">Danger Zone</h2>
        <div className="settings-row">
          <div className="settings-row__info">
            <label className="settings-row__label">Sign Out</label>
            <p className="settings-row__desc">Clears local session and returns to login.</p>
          </div>
          <button className="btn btn--outline settings-danger-btn" onClick={handleClearData}>
            Sign Out
          </button>
        </div>
      </section>
    </div>
  )
}
