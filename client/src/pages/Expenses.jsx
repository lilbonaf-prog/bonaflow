import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import DashboardLayout from '../components/DashboardLayout'
import Modal from '../components/Modal'
import AddExpenseForm from '../components/AddExpenseForm'
import EditExpenseForm from '../components/EditExpenseForm'
import api from '../api/axios'
import './Products.css'

function Expenses() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [deletingExpense, setDeletingExpense] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchExpenses = async () => {
    try {
      const response = await api.get('/expenses')
      setExpenses(response.data)
    } catch {
      setError('Unable to load expenses. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern; setState only runs after the async request resolves, not synchronously
    fetchExpenses()
  }, [])

  const handleExpenseAdded = (newExpense) => {
    setExpenses([newExpense, ...expenses])
  }

  const handleExpenseUpdated = (updatedExpense) => {
    setExpenses(expenses.map((e) => (e._id === updatedExpense._id ? updatedExpense : e)))
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await api.delete(`/expenses/${deletingExpense._id}`)
      setExpenses(expenses.filter((e) => e._id !== deletingExpense._id))
      setDeletingExpense(null)
    } catch {
      setError('Unable to delete the expense. Please try again.')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Expenses</h1>
        <button className="primary-button" onClick={() => setShowAddModal(true)}>
          <FiPlus size={18} />
          <span>Add Expense</span>
        </button>
      </div>

      {loading && <p className="state-message">Loading expenses...</p>}
      {error && <p className="state-message state-error">{error}</p>}

      {!loading && !error && expenses.length === 0 && (
        <div className="empty-state">
          <p>No expenses recorded yet.</p>
          <p className="empty-state-hint">Add your first expense to start tracking spending.</p>
        </div>
      )}

      {!loading && expenses.length > 0 && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense._id}>
                  <td>{new Date(expense.createdAt).toLocaleDateString()}</td>
                  <td>{expense.description}</td>
                  <td>{expense.category}</td>
                  <td>GH₵ {expense.amount.toFixed(2)}</td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="icon-button"
                        onClick={() => setEditingExpense(expense)}
                        aria-label="Edit expense"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        className="icon-button icon-button-danger"
                        onClick={() => setDeletingExpense(expense)}
                        aria-label="Delete expense"
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
        <Modal title="Add Expense" onClose={() => setShowAddModal(false)}>
          <AddExpenseForm onSuccess={handleExpenseAdded} onClose={() => setShowAddModal(false)} />
        </Modal>
      )}

      {editingExpense && (
        <Modal title="Edit Expense" onClose={() => setEditingExpense(null)}>
          <EditExpenseForm
            expense={editingExpense}
            onSuccess={handleExpenseUpdated}
            onClose={() => setEditingExpense(null)}
          />
        </Modal>
      )}

      {deletingExpense && (
        <Modal title="Delete Expense" onClose={() => setDeletingExpense(null)}>
          <p className="confirm-text">
            Are you sure you want to delete <strong>{deletingExpense.description}</strong>? This cannot be undone.
          </p>
          <div className="confirm-actions">
            <button className="secondary-button" onClick={() => setDeletingExpense(null)}>
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

export default Expenses