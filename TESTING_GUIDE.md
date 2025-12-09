# Testing Guide - E-Commerce Features

## Prerequisites
1. Make sure backend server is running on port 5000
2. Make sure frontend is running (npm run dev)
3. Set `VITE_STRIPE_PUBLIC_KEY` in `frontend/.env` with your actual Stripe test key
4. Backend `.env` should have your Stripe secret key configured

## Feature Testing Checklist

### 1. Product Detail Modal
- [ ] Navigate to Home page
- [ ] Hover over any product card - see eye icon appear
- [ ] Click product card or eye icon - modal should open
- [ ] Verify product image, name, price, description display
- [ ] Verify quantity selector works (+/- buttons)
- [ ] For clothing/shoe products:
  - [ ] Size selector should appear (XS, S, M, L, XL, XXL)
  - [ ] Try adding to cart without selecting size - should show alert
  - [ ] Select a size and add to cart
- [ ] For other category products:
  - [ ] Size selector should NOT appear
  - [ ] Add to cart should work directly
- [ ] Close modal with X button or click outside

### 2. Address Management in Cart
- [ ] Add products to cart
- [ ] Go to Cart page
- [ ] See "Shipping Address" section
- [ ] Click "Add Address" button
- [ ] AddressForm modal opens
- [ ] Fill in all fields (street, city, state, postal code, phone)
- [ ] Country field is optional
- [ ] "Set as default address" checkbox works
- [ ] Click "Save Address" - form closes and address displays
- [ ] Click "Change Address" to modify
- [ ] Click "Cancel" in form - closes without saving
- [ ] Verify address displays correctly

### 3. Checkout with Address
- [ ] Have cart with items and address selected
- [ ] Try clicking "Proceed to Checkout" without address:
  - [ ] Should see alert "Please add a shipping address before checkout"
- [ ] Add address first
- [ ] Click "Proceed to Checkout"
- [ ] Should redirect to Stripe payment page
- [ ] Complete payment (use test card: 4242 4242 4242 4242)

### 4. Order Created After Payment
- [ ] Complete payment successfully
- [ ] Should see "Purchase successful" page
- [ ] Check "My Orders" page to see new order

### 5. My Orders Page (Customer)
- [ ] Log in as customer
- [ ] Click "My Orders" in navbar
- [ ] See list of your orders
- [ ] Each order shows:
  - [ ] Order ID (first 8 chars)
  - [ ] Order date
  - [ ] Total amount
  - [ ] Current status (pending/shipped/on-the-way/delivered)
- [ ] Click order to expand
- [ ] Expanded view shows:
  - [ ] Products ordered with quantities and prices
  - [ ] Shipping address
  - [ ] Tracking timeline with status indicators:
    - [ ] Clock icon for "Pending"
    - [ ] Package icon for "Shipped"
    - [ ] Truck icon for "On The Way"
    - [ ] CheckCircle icon for "Delivered"

### 6. Admin Dashboard - Orders Tab
- [ ] Log in as admin user
- [ ] Go to Admin Dashboard
- [ ] Click "Orders" tab (new tab with Package icon)
- [ ] See all orders from all customers
- [ ] Each order shows:
  - [ ] Order ID
  - [ ] Customer name
  - [ ] Order amount
  - [ ] Status dropdown
- [ ] Click order to expand
- [ ] Expanded view shows:
  - [ ] Products ordered
  - [ ] Shipping address
  - [ ] Order metadata
- [ ] Change status using dropdown:
  - [ ] Click dropdown: pending → shipped → on-the-way → delivered
  - [ ] Status should update immediately
- [ ] Go back to customer "My Orders" page
  - [ ] Should see updated status with matching timeline

### 7. Branding Updates
- [ ] Check Footer:
  - [ ] Should say "E-Commerce" not "Forever"
  - [ ] Email: contact@ecommerce.com
  - [ ] No broken image links
- [ ] Check About page:
  - [ ] Should say "About E-Commerce" not "Forever"
  - [ ] Should have modern design with emoji icons
  - [ ] Should have values section
  - [ ] Should have CTA "Start Shopping" button

### 8. Navbar Integration
- [ ] When logged in as customer:
  - [ ] "My Orders" link appears in navbar
  - [ ] Click to navigate to My Orders page
- [ ] When NOT logged in:
  - [ ] "My Orders" link still visible but click does nothing
  - [ ] Or link not visible (depends on implementation)

## Test Data Scenarios

### Scenario 1: Basic Order with Size
1. Add a men's/women's clothing product to cart
2. Go to cart
3. Proceed to checkout (add address)
4. Complete payment
5. Check order in "My Orders"
6. Verify size is stored in order

### Scenario 2: Multiple Products
1. Add 3+ different products to cart
2. Some with sizes, some without
3. Proceed to checkout
4. Complete payment
5. Verify all products appear in order

### Scenario 3: Status Updates
1. Create an order as customer
2. Go to Admin Orders
3. Update status through all stages:
   - pending → shipped
   - shipped → on-the-way
   - on-the-way → delivered
4. Verify customer sees updates in "My Orders"

## Troubleshooting

### Product Detail Modal Not Opening
- Check ProductCard imports are correct
- Verify ProductDetail component is imported
- Check browser console for errors

### Address Not Saving
- Verify all required fields are filled (street, city, state, postal code, phone)
- Check console for API errors
- Verify CartPage state updates properly

### Orders Not Showing in "My Orders"
- Verify user is logged in
- Check backend logs for API errors
- Verify JWT token is valid
- Ensure order routes are registered in server.js

### Admin Orders Tab Not Showing
- Verify user role is "admin"
- Check AdminPage imports OrdersTab
- Verify order routes are accessible
- Check browser console for API errors

### Status Update Not Working
- Verify user is admin
- Check dropdown value changes
- Monitor network tab for PATCH request
- Check backend logs for errors

## Database Queries for Testing

```javascript
// Check order was created with address
db.orders.findOne({stripeSessionId: "cs_test_xxx"})

// Check all orders
db.orders.find().pretty()

// Check user is admin
db.users.findOne({email: "admin@example.com"})
```

## Notes
- All timestamps are in UTC
- Status enum values: "pending", "shipped", "on-the-way", "delivered"
- Size is optional for non-clothing products
- Address can be edited before each checkout
