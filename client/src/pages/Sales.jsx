import { useState, useEffect } from 'react'
import { FiPlus, FiPrinter } from 'react-icons/fi'
import DashboardLayout from '../components/DashboardLayout'
import Modal from '../components/Modal'
import AddSaleForm from '../components/AddSaleForm'
import Receipt from '../components/Receipt'
import api from '../api/axios'
import './Products.css'

function Sales() {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [receiptSale, setReceiptSale] = useState(null)

  const fetchSales = async () => {
    try {
      const response = await api.get('/sales')
      setSales(response.data)
    } catch {
      setError('Unable to load sales. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern; setState only runs after the async request resolves, not synchronously
    fetchSales()
  }, [])

  const handleSaleAdded = (newSale) => {
    fetchSales()
    setReceiptSale(newSale)
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Sales</h1>
        <button className="primary-button" onClick={() => setShowAddModal(true)}>
          <FiPlus size={18} />
          <span>Record Sale</span>
        </button>
      </div>

      {loading && <p className="state-message">Loading sales...</p>}
      {error && <p className="state-message state-error">{error}</p>}

      {!loading && !error && sales.length === 0 && (
        <div className="empty-state">
          <p>No sales recorded yet.</p>
          <p className="empty-state-hint">Record your first sale to start tracking revenue.</p>
        </div>
      )}

      {!loading && sales.length > 0 && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Receipt</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale._id}>
                  <td>{sale.receiptNumber}</td>
                  <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
                  <td>{sale.customer?.fullName || 'Walk-in'}</td>
                  <td>{sale.items.map((i) => `${i.name} x${i.quantity}`).join(', ')}</td>
                  <td>GH₵ {sale.total.toFixed(2)}</td>
                  <td>{sale.paymentMethod}</td>
                  <td>
                    <button
                      className="icon-button"
                      onClick={() => setReceiptSale(sale)}
                      aria-label="View receipt"
                    >
                      <FiPrinter size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <Modal title="Record Sale" onClose={() => setShowAddModal(false)}>
          <AddSaleForm onSuccess={handleSaleAdded} onClose={() => setShowAddModal(false)} />
        </Modal>
      )}

      {receiptSale && (
        <Modal title="Receipt" onClose={() => setReceiptSale(null)}>
          <Receipt sale={receiptSale} />
          <button className="primary-button print-button" onClick={() => window.print()}>
            <FiPrinter size={16} />
            <span>Print Receipt</span>
          </button>
        </Modal>
      )}
    </DashboardLayout>
  )
}

export default Sales