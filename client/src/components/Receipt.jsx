import { getCurrentUser } from '../utils/auth'
import './Receipt.css'

function Receipt({ sale }) {
  const user = getCurrentUser()

  return (
    <div className="receipt">
      <div className="receipt-header">
        <h2>{user?.businessName}</h2>
        <p className="receipt-tagline">Run your business. Know your numbers.</p>
      </div>

      <div className="receipt-meta">
        <div>
          <span>Receipt No.</span>
          <span>{sale.receiptNumber}</span>
        </div>
        <div>
          <span>Date</span>
          <span>{new Date(sale.createdAt).toLocaleString()}</span>
        </div>
        <div>
          <span>Customer</span>
          <span>{sale.customer?.fullName || 'Walk-in'}</span>
        </div>
      </div>

      <table className="receipt-items">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {sale.items.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>GH₵ {item.price.toFixed(2)}</td>
              <td>GH₵ {(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="receipt-total">
        <span>Total</span>
        <span>GH₵ {sale.total.toFixed(2)}</span>
      </div>

      <div className="receipt-payment">
        Paid via {sale.paymentMethod}
      </div>

      {sale.notes && <div className="receipt-notes">Note: {sale.notes}</div>}

      <p className="receipt-footer">Thank you for your business!</p>
    </div>
  )
}

export default Receipt