// Generate sales for the past 14 days for realistic charts
function generateSales() {
  const sales = []
  let id = 10001
  const today = new Date()

  for (let day = 13; day >= 0; day--) {
    const date = new Date(today)
    date.setDate(today.getDate() - day)
    const dateStr = date.toISOString().split('T')[0]
    const count = Math.floor(Math.random() * 5) + 2

    for (let i = 0; i < count; i++) {
      const p1qty = Math.floor(Math.random() * 3) + 1
      const p2qty = Math.floor(Math.random() * 2) + 1
      const subtotal = +(p1qty * 1.00 + p2qty * 2.50).toFixed(2)
      const discount = i % 3 === 0 ? 0.50 : 0
      const total = +(subtotal - discount).toFixed(2)

      sales.push({
        id: id++,
        invoiceNo: `INV-${dateStr.replace(/-/g, '')}-${String(i + 1).padStart(3, '0')}`,
        items: [
          { productId: 1, productName: 'Coca Cola', quantity: p1qty, price: 1.00, cost: 0.50 },
          { productId: 2, productName: 'Coffee Black', quantity: p2qty, price: 2.50, cost: 1.00 }
        ],
        subtotal,
        discount,
        total,
        paymentMethod: i % 2 === 0 ? 'cash' : 'qr',
        date: dateStr,
        status: 'completed'
      })
    }
  }
  return sales
}

export const sales = generateSales()
