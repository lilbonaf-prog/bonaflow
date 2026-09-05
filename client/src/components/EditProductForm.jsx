import { useState } from 'react'
import api from '../api/axios'
import './AddProductForm.css'

function EditProductForm({ product, onSuccess, onClose }) {
  const [formData, setFormData] = useState({
    name: product.name,
    costPrice: product.costPrice,
    sellingPrice: product.sellingPrice,
    quantity: product.quantity,
    lowStockThreshold: product.lowStockThreshold
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
      const response = await api.put(`/products/${product._id}`, {
        name: formData.name,
        costPrice: Number(formData.costPrice),
        sellingPrice: Number(formData.sellingPrice),
        quantity: Number(formData.quantity),
        lowStockThreshold: Number(formData.lowStockThreshold)
      })
      onSuccess(response.data)
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update the product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="product-form">
      {error && <div className="form-error">{error}</div>}

      <label htmlFor="edit-name">Product name</label>
      <input
        id="edit-name"
        name="name"
        type="text"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <div className="form-row">
        <div>
          <label htmlFor="edit-costPrice">Cost price (GH₵)</label>
          <input
            id="edit-costPrice"
            name="costPrice"
            type="number"
            min="0"
            step="0.01"
            value={formData.costPrice}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="edit-sellingPrice">Selling price (GH₵)</label>
          <input
            id="edit-sellingPrice"
            name="sellingPrice"
            type="number"
            min="0"
            step="0.01"
            value={formData.sellingPrice}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div>
          <label htmlFor="edit-quantity">Quantity in stock</label>
          <input
            id="edit-quantity"
            name="quantity"
            type="number"
            min="0"
            value={formData.quantity}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="edit-lowStockThreshold">Low stock alert at</label>
          <input
            id="edit-lowStockThreshold"
            name="lowStockThreshold"
            type="number"
            min="0"
            value={formData.lowStockThreshold}
            onChange={handleChange}
          />
        </div>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  )
}

export default EditProductForm