import { useState, useEffect } from 'react'
import { FiPlus, FiAlertTriangle, FiEdit2, FiTrash2 } from 'react-icons/fi'
import DashboardLayout from '../components/DashboardLayout'
import Modal from '../components/Modal'
import AddProductForm from '../components/AddProductForm'
import EditProductForm from '../components/EditProductForm'
import api from '../api/axios'
import './Products.css'

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingProduct, setDeletingProduct] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products')
      setProducts(response.data)
    } catch {
      setError('Unable to load products. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleProductAdded = (newProduct) => {
    setProducts([newProduct, ...products])
  }

  const handleProductUpdated = (updatedProduct) => {
    setProducts(products.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)))
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await api.delete(`/products/${deletingProduct._id}`)
      setProducts(products.filter((p) => p._id !== deletingProduct._id))
      setDeletingProduct(null)
    } catch {
      setError('Unable to delete the product. Please try again.')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Products</h1>
        <button className="primary-button" onClick={() => setShowAddModal(true)}>
          <FiPlus size={18} />
          <span>Add Product</span>
        </button>
      </div>

      {loading && <p className="state-message">Loading products...</p>}
      {error && <p className="state-message state-error">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <div className="empty-state">
          <p>You haven't added any products yet.</p>
          <p className="empty-state-hint">Add your first product to start tracking inventory.</p>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Cost Price</th>
                <th>Selling Price</th>
                <th>Quantity</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>GH₵ {product.costPrice.toFixed(2)}</td>
                  <td>GH₵ {product.sellingPrice.toFixed(2)}</td>
                  <td>{product.quantity}</td>
                  <td>
                    {product.quantity <= product.lowStockThreshold ? (
                      <span className="badge badge-warning">
                        <FiAlertTriangle size={14} />
                        Low stock
                      </span>
                    ) : (
                      <span className="badge badge-success">In stock</span>
                    )}
                  </td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="icon-button"
                        onClick={() => setEditingProduct(product)}
                        aria-label="Edit product"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        className="icon-button icon-button-danger"
                        onClick={() => setDeletingProduct(product)}
                        aria-label="Delete product"
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
        <Modal title="Add Product" onClose={() => setShowAddModal(false)}>
          <AddProductForm
            onSuccess={handleProductAdded}
            onClose={() => setShowAddModal(false)}
          />
        </Modal>
      )}

      {editingProduct && (
        <Modal title="Edit Product" onClose={() => setEditingProduct(null)}>
          <EditProductForm
            product={editingProduct}
            onSuccess={handleProductUpdated}
            onClose={() => setEditingProduct(null)}
          />
        </Modal>
      )}

      {deletingProduct && (
        <Modal title="Delete Product" onClose={() => setDeletingProduct(null)}>
          <p className="confirm-text">
            Are you sure you want to delete <strong>{deletingProduct.name}</strong>? This cannot be undone.
          </p>
          <div className="confirm-actions">
            <button className="secondary-button" onClick={() => setDeletingProduct(null)}>
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

export default Products