import { useState } from 'react'
import api from '../api/axios'
import './AddProductForm.css'

const categories = ['Transport', 'Rent', 'Utilities', 'Salaries', 'Stock', 'Marketing', 'Other']

function AddExpenseForm({ onSuccess, onClose }) {
  const [formData, setFormData] = useState({
    description: '',
    category: 'Other',
    amount: '',
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
      const response = await api.post('/expenses', {
        ...formData,
        amount: Number(formData.amount)
      })
      onSuccess(response.data)
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save the expense. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="product-form">
      {error && <div className="form-error">{error}</div>}

      <label htmlFor="description">Description</label>
      <input
        id="description"
        name="description"
        type="text"
        value={formData.description}
        onChange={handleChange}
        placeholder="Fuel for delivery van"
        required
      />

      <div className="form-row">
        <div>
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={formData.category} onChange={handleChange}>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="amount">Amount (GH₵)</label>
          <input
            id="amount"
            name="amount"
            type="number"
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <label htmlFor="notes">Notes (optional)</label>
      <input
        id="notes"
        name="notes"
        type="text"
        value={formData.notes}
        onChange={handleChange}
        placeholder="optional"
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Expense'}
      </button>
    </form>
  )
}

export default AddExpenseForm