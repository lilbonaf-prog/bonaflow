import { useState } from 'react'
import api from '../api/axios'
import '../components/AddProductForm.css'

function AddCustomerForm({ onSuccess, onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/customers', formData)
      onSuccess(response.data)
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save the customer. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="product-form">
      {error && <div className="form-error">{error}</div>}

      <label htmlFor="fullName">Full name</label>
      <input
        id="fullName"
        name="fullName"
        type="text"
        value={formData.fullName}
        onChange={handleChange}
        placeholder="Kwame Asante"
        required
      />

      <div className="form-row">
        <div>
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            placeholder="0244123456"
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="optional"
          />
        </div>
      </div>

      <label htmlFor="address">Address</label>
      <input
        id="address"
        name="address"
        type="text"
        value={formData.address}
        onChange={handleChange}
        placeholder="optional"
      />

      <label htmlFor="notes">Notes</label>
      <input
        id="notes"
        name="notes"
        type="text"
        value={formData.notes}
        onChange={handleChange}
        placeholder="optional"
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Customer'}
      </button>
    </form>
  )
}

export default AddCustomerForm