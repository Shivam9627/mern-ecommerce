# Architecture & Data Flow Diagrams

## 1. Order Creation Flow

```
┌─────────────┐
│   Customer  │
└──────┬──────┘
       │
       ├─ Browse Products
       ├─ Click Product Card
       │  ├─ Opens ProductDetail Modal
       │  └─ Select Size (if clothing)
       │
       ├─ Add to Cart
       │  └─ Item added to Zustand store
       │
       ├─ Go to Cart Page
       │  └─ View cart items
       │
       ├─ Add Shipping Address
       │  ├─ Click "Add Address"
       │  └─ Fill AddressForm
       │     └─ Save to CartPage state
       │
       ├─ Click "Proceed to Checkout"
       │  └─ POST /api/payments/create-checkout-session
       │     ├─ Body: {products, couponCode, shippingAddress}
       │     └─ Response: {id: session_id}
       │
       ├─ Redirect to Stripe Checkout
       │  └─ Enter Payment Details
       │
       └─ Payment Success
          └─ Redirect to /purchase-success
             ├─ Frontend: POST /api/payments/checkout-success
             │  ├─ Body: {sessionId}
             │  └─ Create Order
             │     ├─ Save Products
             │     ├─ Save Shipping Address
             │     ├─ Set Status: "pending"
             │     └─ Save Stripe Session ID
             │
             └─ Order Created in Database ✓
```

## 2. Database Schema

```
Order Document:
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  products: [
    {
      product: ObjectId (ref: Product),
      quantity: Number,
      price: Number
    }
  ],
  totalAmount: Number,
  status: "pending" | "shipped" | "on-the-way" | "delivered",
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phone: String,
    isDefault: Boolean
  },
  stripeSessionId: String,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## 3. Component Architecture

```
Frontend Structure:
─────────────────

App.jsx
├── HomePage
│   ├── ProductsList
│   │   └── ProductCard
│   │       └── ProductDetail (Modal)
│   └── FeaturedProducts
│
├── CategoryPage
│   └── ProductsList
│       └── ProductCard
│           └── ProductDetail (Modal)
│
├── CartPage
│   ├── CartItem
│   ├── AddressForm (integrated)
│   ├── OrderSummary
│   │   └── Stripe Checkout
│   └── GiftCouponCard
│
├── MyOrders Page (Protected)
│   └── Order List
│       ├── Order Summary (expandable)
│       └── Order Details
│           ├── Products
│           ├── Shipping Address
│           └── Tracking Timeline
│
└── AdminPage (Protected)
    ├── CreateProductForm
    ├── ProductsList
    ├── OrdersTab (NEW)
    │   └── Order List
    │       ├── Order Summary (expandable)
    │       ├── Order Details
    │       └── Status Dropdown
    └── AnalyticsTab
```

## 4. Admin Order Management Flow

```
┌─────────┐
│  Admin  │
└────┬────┘
     │
     ├─ Go to Admin Dashboard
     │
     ├─ Click "Orders" Tab
     │  └─ GET /api/orders/all-orders (Protected + Admin)
     │     └─ Fetch all orders from DB
     │
     ├─ See Order List
     │  ├─ Order ID
     │  ├─ Customer Name
     │  ├─ Amount
     │  └─ Status Dropdown
     │
     ├─ Click Order to Expand
     │  └─ Show:
     │     ├─ Products ordered
     │     ├─ Shipping address
     │     └─ Order metadata
     │
     ├─ Change Status (Dropdown)
     │  ├─ pending
     │  ├─ shipped
     │  ├─ on-the-way
     │  └─ delivered
     │
     ├─ Click Status Change
     │  └─ PATCH /api/orders/:orderId/status
     │     ├─ Body: {status: "shipped"}
     │     └─ Update DB
     │
     └─ Customer Sees Update (in My Orders)
        └─ Tracking Timeline Updated
```

## 5. Tracking Timeline States

```
Status Flow:
────────────

Pending → Shipped → On The Way → Delivered
   │          │         │           │
   ⏰         📦        🚚          ✓

UI Representation:
─────────────────

Pending Step:
⏰ (Clock icon)
"Order Pending"
"Your order has been placed"

Shipped Step:
📦 (Package icon)
"Shipped"
"Your order has been shipped"

On The Way Step:
🚚 (Truck icon)
"On The Way"
"Your order is in transit"

Delivered Step:
✓ (CheckCircle icon)
"Delivered"
"Your order has been delivered"
```

## 6. API Request/Response Flow

```
Client (Frontend)
    │
    ├─ GET /api/orders/my-orders
    │  ├─ Headers: {Authorization: "Bearer token"}
    │  └─ Response: [Order[], ...]
    │
    ├─ GET /api/orders/all-orders (Admin)
    │  ├─ Headers: {Authorization: "Bearer token"}
    │  ├─ Middleware: protectRoute (auth check)
    │  ├─ Middleware: getAdminRoute (role check)
    │  └─ Response: [Order[], ...]
    │
    ├─ PATCH /api/orders/:orderId/status
    │  ├─ Headers: {Authorization: "Bearer token"}
    │  ├─ Body: {status: "shipped"}
    │  ├─ Middleware: protectRoute
    │  ├─ Middleware: getAdminRoute
    │  └─ Response: {Updated Order}
    │
    ├─ POST /api/payments/create-checkout-session
    │  ├─ Headers: {Authorization: "Bearer token"}
    │  ├─ Body: {
    │  │   products: [...],
    │  │   couponCode: "CODE123",
    │  │   shippingAddress: {...}
    │  │ }
    │  └─ Response: {id: "cs_test_xxx"}
    │
    └─ POST /api/payments/checkout-success
       ├─ Body: {sessionId: "cs_test_xxx"}
       ├─ Retrieve from Stripe
       ├─ Create Order with shippingAddress
       └─ Response: {orderId: "xxx", success: true}
```

## 7. Middleware Chain

```
Protected Routes:
────────────────

GET /api/orders/my-orders
    │
    ├─ protectRoute Middleware
    │  ├─ Verify JWT token
    │  ├─ Decode user info
    │  └─ Attach req.user
    │
    └─ getMyOrders Controller
       ├─ Query: Order.find({user: req.user._id})
       └─ Response: User's orders only

Admin Routes:
─────────────

PATCH /api/orders/:orderId/status
    │
    ├─ protectRoute Middleware
    │  ├─ Verify JWT token
    │  └─ Attach req.user
    │
    ├─ getAdminRoute Middleware (NEW)
    │  ├─ Check: req.user.role === "admin"
    │  └─ Reject if not admin (403)
    │
    └─ updateOrderStatus Controller
       ├─ Validate status enum
       ├─ Update order
       └─ Response: Updated order
```

## 8. Size Selection Logic

```
Product Categories → Size Selector
────────────────────────────────────

Clothing Items:
├─ Contains "men" → Show Sizes (XS-XXL)
├─ Contains "women" → Show Sizes (XS-XXL)
├─ Contains "kids" → Show Sizes (XS-XXL)
└─ Contains "shoes" → Show Sizes (XS-XXL)

Non-Clothing:
├─ "Accessories" → No size selector
├─ "Electronics" → No size selector
└─ Other categories → No size selector

When Adding to Cart:
────────────────────
├─ If size required
│  └─ Must select size before add-to-cart
│     └─ Show: "Please select a size"
│
└─ If no size required
   └─ Add to cart directly
```

## 9. State Management

```
Frontend Stores (Zustand):
──────────────────────────

useCartStore
├─ cart: Product[]
├─ addToCart(product)
├─ removeFromCart(productId)
├─ updateQuantity(productId, qty)
├─ total: Number
├─ subtotal: Number
└─ coupon: Coupon | null

useUserStore
├─ user: User | null
├─ login(credentials)
├─ logout()
├─ signup(data)
└─ isLoading: Boolean

useProductStore
├─ products: Product[]
├─ loading: Boolean
├─ fetchAllProducts()
├─ searchTerm: String
└─ category: String

useOrderStore (NEW)
├─ orders: Order[]
├─ isLoading: Boolean
├─ fetchAllOrders() → GET /api/orders/all-orders
└─ updateOrderStatus(orderId, status) → PATCH /api/orders/:orderId/status
```

## 10. Error Handling

```
Checkout Error Scenarios:
─────────────────────────

No Stripe Key
└─ console.error("Missing Stripe publishable key")
└─ User sees: Nothing happens, check console

No Address
└─ alert("Please add a shipping address before checkout")
└─ Checkout blocked

Stripe Session Creation Fails
└─ console.error("Error processing checkout")
└─ Response status: 500
└─ User sees: Error logged to console

Payment Fails
└─ Stripe handles and shows error
└─ No order created

API Error on Status Update
└─ console.error("Error updating order")
└─ Status change reverted on reload
└─ User should retry
```

## 11. Feature Timeline

```
User Journey Timeline:
──────────────────────

1. Browse (Home/Category)
   └─ See products

2. Product Detail
   └─ Click card → Modal opens
   └─ View full details
   └─ Select size (if clothing)
   └─ Select quantity

3. Add to Cart
   └─ Confirm toast notification

4. Checkout
   └─ Add address
   └─ Verify items
   └─ Complete payment

5. Order Created
   └─ Status: Pending
   └─ Stripe Session ID: Stored

6. Track Order
   └─ My Orders page
   └─ See status updates:
      - Pending
      - Shipped
      - On The Way
      - Delivered

Admin Journey:
──────────────

1. Dashboard
   └─ Click Orders tab

2. View Orders
   └─ See all customer orders

3. Update Status
   └─ Change: pending → shipped
   └─ Change: shipped → on-the-way
   └─ Change: on-the-way → delivered

4. Customer Notification
   └─ Customer sees update
   └─ Tracking timeline progresses
```

---

## File Organization

```
Frontend:
frontend/
├── src/
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── CartPage.jsx (Updated)
│   │   ├── MyOrders.jsx (New)
│   │   ├── AdminPage.jsx (Updated)
│   │   └── ...
│   ├── components/
│   │   ├── ProductCard.jsx (Updated)
│   │   ├── ProductDetail.jsx (New)
│   │   ├── OrderSummary.jsx (Updated)
│   │   ├── AddressForm.jsx
│   │   ├── OrdersTab.jsx (New)
│   │   └── ...
│   └── stores/
│       ├── useOrderStore.js (New)
│       └── ...
└── .env (New)

Backend:
backend/
├── models/
│   └── order.model.js (Updated)
├── controllers/
│   ├── order.controller.js (New)
│   └── payment.controller.js (Updated)
├── routes/
│   └── order.route.js (New)
├── middleware/
│   └── admin.middleware.js (New)
└── server.js (Updated)
```
