import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import DashboardLayout from '../components/DashboardLayout'
import Modal from '../components/Modal'
import AddCustomerForm from '../components/AddCustomerForm'
import EditCustomerForm from '../components/EditCustomerForm'
import api from '../api/axios'
import './Products.css'

function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [deletingCustomer, setDeletingCustomer] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers')
      setCustomers(response.data)
    } catch {
      setError('Unable to load customers. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const handleCustomerAdded = (newCustomer) => {
    setCustomers([newCustomer, ...customers])
  }

  const handleCustomerUpdated = (updatedCustomer) => {
    setCustomers(customers.map((c) => (c._id === updatedCustomer._id ? updatedCustomer : c)))
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await api.delete(`/customers/${deletingCustomer._id}`)
      setCustomers(customers.filter((c) => c._id !== deletingCustomer._id))
      setDeletingCustomer(null)
    } catch {
      setError('Unable to delete the customer. Please try again.')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Customers</h1>
        <button className="primary-button" onClick={() => setShowAddModal(true)}>
          <FiPlus size={18} />
          <span>Add Customer</span>
        </button>
      </div>

      {loading && <p className="state-message">Loading customers...</p>}
      {error && <p className="state-message state-error">{error}</p>}

      {!loading && !error && customers.length === 0 && (
        <div className="empty-state">
          <p>You haven't added any customers yet.</p>
          <p className="empty-state-hint">Add your first customer to start tracking their purchase history.</p>
        </div>
      )}

      {!loading && customers.length > 0 && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id}>
                  <td>{customer.fullName}</td>
                  <td>{customer.phone || '—'}</td>
                  <td>{customer.email || '—'}</td>
                  <td>{customer.address || '—'}</td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="icon-button"
                        onClick={() => setEditingCustomer(customer)}
                        aria-label="Edit customer"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        className="icon-button icon-button-danger"
                        onClick={() => setDeletingCustomer(customer)}
                        aria-label="Delete customer"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <Modal title="Add Customer" onClose={() => setShowAddModal(false)}>
          <AddCustomerForm
            onSuccess={handleCustomerAdded}
            onClose={() => setShowAddModal(false)}
          />
        </Modal>
      )}

      {editingCustomer && (
        <Modal title="Edit Customer" onClose={() => setEditingCustomer(null)}>
          <EditCustomerForm
            customer={editingCustomer}
            onSuccess={handleCustomerUpdated}
            onClose={() => setEditingCustomer(null)}
          />
        </Modal>
      )}

      {deletingCustomer && (
        <Modal title="Delete Customer" onClose={() => setDeletingCustomer(null)}>
          <p className="confirm-text">
            Are you sure you want to delete <strong>{deletingCustomer.fullName}</strong>? This cannot be undone.
          </p>
          <div className="confirm-actions">
            <button className="secondary-button" onClick={() => setDeletingCustomer(null)}>
              Cancel
            </button>
            <button className="danger-button" onClick={handleDelete} disabled={deleteLoading}>
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  )
}

export default Customers