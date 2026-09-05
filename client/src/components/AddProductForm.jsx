import { useState } from 'react'
import api from '../api/axios'
import './AddProductForm.css'

function AddProductForm({ onSuccess, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    costPrice: '',
    sellingPrice: '',
    quantity: '',
    lowStockThreshold: ''
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
      const response = await api.post('/products', {
        name: formData.name,
        costPrice: Number(formData.costPrice),
        sellingPrice: Number(formData.sellingPrice),
        quantity: Number(formData.quantity) || 0,
        lowStockThreshold: Number(formData.lowStockThreshold) || 5
      })
      onSuccess(response.data)
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save the product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="product-form">
      {error && <div className="form-error">{error}</div>}

      <label htmlFor="name">Product name</label>
      <input
        id="name"
        name="name"
        type="text"
        value={formData.name}
        onChange={handleChange}
        placeholder="Samsung Galaxy A15"
        required
      />

      <div className="form-row">
        <div>
          <label htmlFor="costPrice">Cost price (GH₵)</label>
          <input
            id="costPrice"
            name="costPrice"
            type="number"
            min="0"
            step="0.01"
            value={formData.costPrice}
            onChange={handleChange}
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label htmlFor="sellingPrice">Selling price (GH₵)</label>
          <input
            id="sellingPrice"
            name="sellingPrice"
            type="number"
            min="0"
            step="0.01"
            value={formData.sellingPrice}
            onChange={handleChange}
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div>
          <label htmlFor="quantity">Quantity in stock</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min="0"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="0"
          />
        </div>

        <div>
          <label htmlFor="lowStockThreshold">Low stock alert at</label>
          <input
            id="lowStockThreshold"
            name="lowStockThreshold"
            type="number"
            min="0"
            value={formData.lowStockThreshold}
            onChange={handleChange}
            placeholder="5"
          />
        </div>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Product'}
      </button>
    </form>
  )
}

export default AddProductForm