# Quick Setup & Deployment Guide

## Setup Steps

### 1. Backend Configuration
```bash
cd backend

# Verify these are in your .env:
STRIPE_SECRET_KEY=sk_test_xxx
CLIENT_URL=http://localhost:5173
UPSTASH_REDIS_URL=redis://...
MONGODB_URI=mongodb://...
JWT_SECRET=your_secret
NODE_ENV=development
PORT=5000

# Start backend
npm start
```

### 2. Frontend Configuration
```bash
cd frontend

# Create/Update .env with:
VITE_STRIPE_PUBLIC_KEY=pk_test_xxx

# Install dependencies if needed
npm install

# Start frontend
npm run dev
```

### 3. Database Setup (MongoDB)
The Order model now includes:
- `status`: enum field (pending, shipped, on-the-way, delivered)
- `shippingAddress`: object with address details

If you're using an existing database, existing orders will have:
- `status`: defaults to "pending"
- `shippingAddress`: defaults to null (safe)

### 4. Stripe Test Keys
Get test keys from https://dashboard.stripe.com

- **Publishable Key** (pk_test_xxx):
  - Add to `frontend/.env` as `VITE_STRIPE_PUBLIC_KEY`
  - This key is public, safe to commit to repo

- **Secret Key** (sk_test_xxx):
  - Add to `backend/.env` as `STRIPE_SECRET_KEY`
  - Keep this secret, don't commit to repo

## Testing Payment Flow

### Test Card Details
Use these with Stripe:
- **Card Number**: 4242 4242 4242 4242
- **Expiry**: Any future date (e.g., 12/25)
- **CVC**: Any 3 digits (e.g., 123)

### Order Workflow
1. Add products to cart
2. Go to cart page
3. Add shipping address
4. Proceed to checkout
5. Enter test card details
6. Complete payment
7. Order created with "pending" status

## Feature Checklist

- [x] Product detail modal with size selection
- [x] Address management during checkout
- [x] Order creation with shipping address
- [x] Customer order tracking (My Orders page)
- [x] Admin order management (Orders tab)
- [x] Order status updates (pending → shipped → on-the-way → delivered)
- [x] Branding updates (Forever → E-Commerce)
- [x] Enhanced About page
- [x] Navbar integration with My Orders link

## Deployment Checklist

### Before Going Live
- [ ] Remove/obfuscate test Stripe keys
- [ ] Switch to production Stripe keys
- [ ] Update `CLIENT_URL` to production domain
- [ ] Verify all environment variables are set
- [ ] Test full payment flow with live keys
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Set `NODE_ENV=production`
- [ ] Review admin user permissions

### Database Migration (if upgrading existing db)
```javascript
// Orders will automatically have:
// status: "pending" (default)
// shippingAddress: null (or whatever was saved)

// No migration needed - backward compatible
```

## API Endpoints Reference

### New Order Endpoints
```
GET  /api/orders/my-orders           (protected, customer)
GET  /api/orders/all-orders          (protected, admin only)
PATCH /api/orders/:orderId/status    (protected, admin only)
POST /api/payments/create-checkout-session (now accepts shippingAddress)
```

### Request/Response Examples

**Create Checkout Session** (POST /api/payments/create-checkout-session)
```json
{
  "products": [
    {
      "_id": "product_id",
      "name": "Product Name",
      "price": 29.99,
      "image": "image_url",
      "quantity": 2
    }
  ],
  "couponCode": "GIFT123ABC",
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA",
    "phone": "555-1234",
    "isDefault": false
  }
}
```

**Get My Orders** (GET /api/orders/my-orders)
```json
[
  {
    "_id": "order_id",
    "user": { "name": "John Doe", "_id": "user_id" },
    "products": [
      {
        "product": { "name": "Product", "price": 29.99 },
        "quantity": 1,
        "price": 29.99
      }
    ],
    "totalAmount": 29.99,
    "status": "pending",
    "shippingAddress": {...},
    "stripeSessionId": "cs_test_xxx",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

**Update Order Status** (PATCH /api/orders/:orderId/status)
```json
{
  "status": "shipped"
}
```

## Troubleshooting

### Orders Not Saving with Address
- Verify `shippingAddress` is in request body
- Check backend logs for save errors
- Verify Order model has shippingAddress field

### Admin Tab Not Visible
- Confirm user has `role: "admin"`
- Check AdminPage imports OrdersTab
- Verify routes are registered

### Product Detail Modal Not Opening
- Clear browser cache
- Check network tab for errors
- Verify ProductCard imports ProductDetail

### Stripe Payment Errors
- Verify keys are correct (pk_test vs sk_test)
- Check keys match Stripe account
- Verify CLIENT_URL is correct
- Check browser console for detailed errors

## Support

For issues, check:
1. Browser console (DevTools → Console)
2. Backend logs (terminal output)
3. Network tab (DevTools → Network)
4. IMPLEMENTATION_SUMMARY.md for feature details
5. TESTING_GUIDE.md for test procedures

## Performance Notes

- Frontend build: ~800KB gzipped (consider code splitting for large applications)
- Order queries are optimized with `.populate()` for user/product details
- Consider adding pagination for admin orders view if you have thousands of orders

## Security Notes

- Stripe keys are properly handled (secret in backend, public in frontend)
- Order routes are protected with authentication middleware
- Admin routes checked with `getAdminRoute()` middleware
- User can only see their own orders (filtered by userId)
- No sensitive data exposed in responses

## Monitoring & Logging

Add these for production:
```javascript
// Backend: Log all order operations
console.log("Created order:", orderId, "for user:", userId);
console.log("Updated order status:", orderId, "to:", newStatus);

// Monitor Stripe webhook for payment confirmations
// Implement retry logic for failed payments
```
