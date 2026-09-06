import { useState } from 'react'
import api from '../api/axios'
import './AddProductForm.css'

const categories = ['Transport', 'Rent', 'Utilities', 'Salaries', 'Stock', 'Marketing', 'Other']

function EditExpenseForm({ expense, onSuccess, onClose }) {
  const [formData, setFormData] = useState({
    description: expense.description,
    category: expense.category,
    amount: expense.amount,
    notes: expense.notes || ''
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
      const response = await api.put(`/expenses/${expense._id}`, {
        ...formData,
        amount: Number(formData.amount)
      })
      onSuccess(response.data)
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update the expense. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="product-form">
      {error && <div className="form-error">{error}</div>}

      <label htmlFor="edit-description">Description</label>
      <input
        id="edit-description"
        name="description"
        type="text"
        value={formData.description}
        onChange={handleChange}
        required
      />

      <div className="form-row">
        <div>
          <label htmlFor="edit-category">Category</label>
          <select id="edit-category" name="category" value={formData.category} onChange={handleChange}>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="edit-amount">Amount (GH₵)</label>
          <input
            id="edit-amount"
            name="amount"
            type="number"
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <label htmlFor="edit-notes">Notes (optional)</label>
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

export default EditExpenseForm