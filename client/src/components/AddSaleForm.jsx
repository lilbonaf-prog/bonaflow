import { useState, useEffect } from 'react'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import api from '../api/axios'
import './AddSaleForm.css'

function AddSaleForm({ onSuccess, onClose }) {
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [customerId, setCustomerId] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState([{ productId: '', quantity: 1 }])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const [productsRes, customersRes] = await Promise.all([
        api.get('/products'),
        api.get('/customers')
      ])
      setProducts(productsRes.data)
      setCustomers(customersRes.data)
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern; setState only runs after the async request resolves, not synchronously
    loadData()
  }, [])

  const handleItemChange = (index, field, value) => {
    const updated = [...items]
    updated[index][field] = value
    setItems(updated)
  }

  const addItemRow = () => {
    setItems([...items, { productId: '', quantity: 1 }])
  }

  const removeItemRow = (index) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const getProduct = (productId) => products.find((p) => p._id === productId)

  const total = items.reduce((sum, item) => {
    const product = getProduct(item.productId)
    return product ? sum + product.sellingPrice * Number(item.quantity || 0) : sum
  }, 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const validItems = items.filter((item) => item.productId && item.quantity > 0)
    if (validItems.length === 0) {
      setError('Please add at least one product to the sale')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/sales', {
        customer: customerId || null,
        items: validItems.map((item) => ({
          productId: item.productId,
          quantity: Number(item.quantity)
        })),
        paymentMethod,
        notes
      })
      onSuccess(response.data)
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to record the sale. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="sale-form">
      {error && <div className="form-error">{error}</div>}

      <label htmlFor="customer">Customer (optional)</label>
      <select id="customer" value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
        <option value="">Walk-in customer</option>
        {customers.map((c) => (
          <option key={c._id} value={c._id}>{c.fullName}</option>
        ))}
      </select>

      <label>Products</label>
      {items.map((item, index) => {
        const product = getProduct(item.productId)
        return (
          <div className="sale-item-row" key={index}>
            <select
              value={item.productId}
              onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
            >
              <option value="">Select a product</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>{p.name} (GH₵{p.sellingPrice} — {p.quantity} in stock)</option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              max={product?.quantity || undefined}
              value={item.quantity}
              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
            />
            {items.length > 1 && (
              <button type="button" className="remove-item-button" onClick={() => removeItemRow(index)} aria-label="Remove item">
                <FiTrash2 size={16} />
              </button>
            )}
          </div>
        )
      })}

      <button type="button" className="add-item-button" onClick={addItemRow}>
        <FiPlus size={16} />
        Add another product
      </button>

      <label htmlFor="paymentMethod">Payment method</label>
      <select id="paymentMethod" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
        <option value="Cash">Cash</option>
        <option value="Mobile Money">Mobile Money</option>
        <option value="Card">Card</option>
        <option value="Bank Transfer">Bank Transfer</option>
      </select>

      <label htmlFor="notes">Notes (optional)</label>
      <input
        id="notes"
        type="text"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Optional"
      />

      <div className="sale-total">
        <span>Total</span>
        <span>GH₵ {total.toFixed(2)}</span>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Recording sale...' : 'Record Sale'}
      </button>
    </form>
  )
}

export default AddSaleForm