import { useState } from 'react'
import api from '../api/axios'
import './AddProductForm.css'

function EditCustomerForm({ customer, onSuccess, onClose }) {
  const [formData, setFormData] = useState({
    fullName: customer.fullName,
    phone: customer.phone || '',
    email: customer.email || '',
    address: customer.address || '',
    notes: customer.notes || ''
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
      const response = await api.put(`/customers/${customer._id}`, formData)
      onSuccess(response.data)
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update the customer. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="product-form">
      {error && <div className="form-error">{error}</div>}

      <label htmlFor="edit-fullName">Full name</label>
      <input
        id="edit-fullName"
        name="fullName"
        type="text"
        value={formData.fullName}
        onChange={handleChange}
        required
      />

      <div className="form-row">
        <div>
          <label htmlFor="edit-phone">Phone</label>
          <input
            id="edit-phone"
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="edit-email">Email</label>
          <input
            id="edit-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>

      <label htmlFor="edit-address">Address</label>
      <input
        id="edit-address"
        name="address"
        type="text"
        value={formData.address}
        onChange={handleChange}
      />

      <label htmlFor="edit-notes">Notes</label>
      <input
        id="edit-notes"
        name="notes"
        type="text"
        value={formData.notes}
        onChange={handleChange}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  )
}

export default EditCustomerForm