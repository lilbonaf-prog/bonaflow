import { useState, useEffect, useRef } from 'react'
import { FiUpload } from 'react-icons/fi'
import DashboardLayout from '../components/DashboardLayout'
import api from '../api/axios'
import './Settings.css'

const currencies = ['GHS', 'NGN', 'USD', 'EUR', 'GBP', 'KES', 'ZAR']

function Settings() {
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    businessName: '',
    phone: '',
    address: '',
    currency: 'GHS'
  })
  const [logoUrl, setLogoUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const fetchUser = async () => {
    try {
      const response = await api.get('/users/me')
      setFormData({
        businessName: response.data.businessName,
        phone: response.data.phone || '',
        address: response.data.address || '',
        currency: response.data.currency
      })
      setLogoUrl(response.data.logoUrl || '')
    } catch {
      setError('Unable to load your business settings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern; setState only runs after the async request resolves, not synchronously
    fetchUser()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setSuccess(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setSaving(true)

    try {
      const response = await api.put('/users/me', formData)
      localStorage.setItem('user', JSON.stringify({
        ...JSON.parse(localStorage.getItem('user')),
        businessName: response.data.businessName,
        currency: response.data.currency
      }))
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save your changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleLogoSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setError('')
    setUploadingLogo(true)

    const uploadData = new FormData()
    uploadData.append('logo', file)

    try {
      const response = await api.post('/users/me/logo', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setLogoUrl(response.data.logoUrl)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to upload the logo. Please try again.')
    } finally {
      setUploadingLogo(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <p className="state-message">Loading settings...</p>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Business Settings</h1>
      </div>

      <div className="settings-card">
        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">Your business settings have been saved.</div>}

        <div className="logo-section">
          <div className="logo-preview">
            {logoUrl ? (
              <img src={logoUrl} alt="Business logo" />
            ) : (
              <span>No logo</span>
            )}
          </div>
          <div>
            <button
              type="button"
              className="secondary-button"
              onClick={() => fileInputRef.current.click()}
              disabled={uploadingLogo}
            >
              <FiUpload size={16} />
              {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleLogoSelect}
              style={{ display: 'none' }}
            />
            <p className="logo-hint">PNG or JPG, up to 5MB</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="settings-form">
          <label htmlFor="businessName">Business name</label>
          <input
            id="businessName"
            name="businessName"
            type="text"
            value={formData.businessName}
            onChange={handleChange}
            required
          />

          <label htmlFor="phone">Business phone</label>
          <input
            id="phone"
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            placeholder="0244123456"
          />

          <label htmlFor="address">Business address</label>
          <input
            id="address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 High Street, Accra"
          />

          <label htmlFor="currency">Currency</label>
          <select id="currency" name="currency" value={formData.currency} onChange={handleChange}>
            {currencies.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default Settings