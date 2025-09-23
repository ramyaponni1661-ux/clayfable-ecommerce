# Razorpay Payment Gateway Integration Guide

## Overview
This document provides a comprehensive guide for the Razorpay payment gateway integration implemented in the Clayfable e-commerce platform.

## Table of Contents
1. [Setup & Configuration](#setup--configuration)
2. [Architecture Overview](#architecture-overview)
3. [Implementation Details](#implementation-details)
4. [API Endpoints](#api-endpoints)
5. [Security & Best Practices](#security--best-practices)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

## Setup & Configuration

### Prerequisites
- Razorpay Account (Test/Live)
- Valid API Keys
- SSL Certificate (Required for production)

### Environment Variables
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_RKyhirvqCo8Iro
RAZORPAY_KEY_SECRET=O0SvI6E2ZnnDgYb7C60Lorxc
```

### Dependencies
```json
{
  "razorpay": "^2.9.2"
}
```

## Architecture Overview

### Flow Diagram
```
1. User initiates payment →
2. Create Razorpay order (Backend) →
3. Open Razorpay Checkout (Frontend) →
4. User completes payment →
5. Verify payment signature (Backend) →
6. Update order status →
7. Redirect to success page
```

### Component Structure
```
components/
├── razorpay-payment.tsx      # Main payment component
app/api/payment/
├── create-order/route.ts     # Order creation endpoint
└── verify/route.ts           # Payment verification endpoint
```

## Implementation Details

### 1. Frontend Integration (`components/razorpay-payment.tsx`)

**Key Features:**
- Dynamic script loading
- Secure payment handling
- Real-time payment status
- Error handling & recovery
- Loading states

**Configuration Options:**
```javascript
const options = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  amount: orderData.amount,           // Amount in paise
  currency: 'INR',
  name: 'Clayfable',
  description: 'Authentic Terracotta Products',
  image: '/icon-transparent.png',
  order_id: orderData.orderId,
  prefill: {
    name: customerName,
    email: customerEmail,
    contact: customerPhone,
  },
  theme: {
    color: '#ea580c'                  // Orange brand color
  }
}
```

### 2. Order Creation API (`/api/payment/create-order`)

**Purpose:** Creates a Razorpay order before payment
**Method:** POST
**Security:** Server-side validation, amount verification

```javascript
const options = {
  amount: Math.round(amount * 100),   // Convert to paise
  currency: 'INR',
  receipt: `receipt_${Date.now()}`,
  notes: {
    company: 'Clayfable',
    website: 'clayfable.com'
  }
}
```

### 3. Payment Verification API (`/api/payment/verify`)

**Purpose:** Verify payment signature for security
**Method:** POST
**Security:** HMAC-SHA256 signature verification

```javascript
const sign = razorpay_order_id + '|' + razorpay_payment_id
const expectedSign = crypto
  .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
  .update(sign.toString())
  .digest('hex')
```

## API Endpoints

### POST `/api/payment/create-order`
**Request:**
```json
{
  "amount": 1299,
  "currency": "INR",
  "receipt": "receipt_1640995200"
}
```

**Response:**
```json
{
  "orderId": "order_xyz123",
  "amount": 129900,
  "currency": "INR",
  "keyId": "rzp_live_xxxxx"
}
```

### POST `/api/payment/verify`
**Request:**
```json
{
  "razorpay_order_id": "order_xyz123",
  "razorpay_payment_id": "pay_abc456",
  "razorpay_signature": "signature_hash"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "orderId": "order_xyz123",
  "paymentId": "pay_abc456"
}
```

## Security & Best Practices

### 1. Server-Side Verification
- **NEVER** trust client-side payment status
- Always verify payment signature on server
- Use HMAC-SHA256 for signature verification

### 2. Environment Security
- Store API keys in environment variables
- Use different keys for test/production
- Never expose secret key in client-side code

### 3. Amount Validation
- Verify amount server-side before order creation
- Convert amounts to paise (multiply by 100)
- Validate against original cart total

### 4. Error Handling
```javascript
// Handle payment failures gracefully
rzp.on('payment.failed', function (response) {
  console.error('Payment failed:', response.error)
  // Show user-friendly error message
  // Log error for debugging
})
```

## Testing

### Test Card Numbers
| Card Type | Number | CVV | Expiry |
|-----------|--------|-----|--------|
| Visa | 4111111111111111 | 123 | 12/25 |
| MasterCard | 5555555555554444 | 123 | 12/25 |
| Amex | 378282246310005 | 1234 | 12/25 |

### Test UPI ID
- `success@razorpay`
- `failure@razorpay`

### Test Scenarios
1. **Successful Payment:** Use valid test cards
2. **Failed Payment:** Use `4000000000000002`
3. **Network Error:** Simulate network failure
4. **User Cancellation:** Close payment modal

## Troubleshooting

### Common Issues

#### 1. "Key ID is missing"
**Solution:** Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set correctly

#### 2. "Payment verification failed"
**Solution:** Check `RAZORPAY_KEY_SECRET` and signature generation

#### 3. "Script loading failed"
**Solution:** Ensure HTTPS and check network connectivity

#### 4. "Amount mismatch"
**Solution:** Verify amount is in paise (multiply by 100)

### Debug Steps
1. Check browser console for errors
2. Verify environment variables
3. Test with small amounts first
4. Check Razorpay dashboard for payment status

## Supported Payment Methods

### Cards
- Visa, MasterCard, Amex, Diners, RuPay
- Debit and Credit Cards
- International Cards (configurable)

### Digital Wallets
- Paytm, PhonePe, Google Pay
- Amazon Pay, Mobikwik
- Freecharge, Ola Money

### Net Banking
- All major Indian banks
- Real-time bank transfers

### UPI
- All UPI-enabled apps
- QR code payments
- UPI ID payments

## Webhooks (Optional)

### Setup Webhook URL
`https://www.clayfable.com/api/webhooks/razorpay`

### Webhook Events
- `payment.captured`
- `payment.failed`
- `order.paid`

### Webhook Verification
```javascript
const isValidWebhook = razorpay.webhooks.validateWebhookSignature(
  body,
  signature,
  process.env.RAZORPAY_WEBHOOK_SECRET
)
```

## Production Checklist

- [ ] Live API keys configured
- [ ] SSL certificate installed
- [ ] Webhook URLs updated
- [ ] Test all payment methods
- [ ] Verify error handling
- [ ] Check success/failure flows
- [ ] Test refund process
- [ ] Monitor payment analytics

## Support Resources

- **Razorpay Documentation:** https://razorpay.com/docs/
- **API Reference:** https://razorpay.com/docs/api/
- **Test Environment:** https://dashboard.razorpay.com/test/
- **Support:** https://razorpay.com/support/

---

**Implementation Status:** ✅ Complete
**Last Updated:** September 23, 2025
**Version:** 1.0.0