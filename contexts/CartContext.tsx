"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'

// Types
export interface CartItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  quantity: number
  inStock: boolean
  maxQuantity?: number
}

interface CartState {
  items: CartItem[]
  itemCount: number
  totalAmount: number
  totalSavings: number
  isLoading: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> & { quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'SET_LOADING'; payload: boolean }

interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getItem: (id: string) => CartItem | undefined
  isInCart: (id: string) => boolean
}

// Initial state
const initialState: CartState = {
  items: [],
  itemCount: 0,
  totalAmount: 0,
  totalSavings: 0,
  isLoading: false,
}

// Reducer function
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id)

      if (existingItem) {
        // Update existing item quantity
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.min(item.quantity + (action.payload.quantity || 1), item.maxQuantity || 99) }
            : item
        )
        return calculateTotals({ ...state, items: updatedItems })
      } else {
        // Add new item
        const newItem: CartItem = {
          ...action.payload,
          quantity: action.payload.quantity || 1
        }
        return calculateTotals({ ...state, items: [...state.items, newItem] })
      }
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload.id)
      return calculateTotals({ ...state, items: updatedItems })
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { id: action.payload.id } })
      }

      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.min(action.payload.quantity, item.maxQuantity || 99) }
          : item
      )
      return calculateTotals({ ...state, items: updatedItems })
    }

    case 'CLEAR_CART': {
      return { ...initialState }
    }

    case 'LOAD_CART': {
      return calculateTotals({ ...state, items: action.payload })
    }

    case 'SET_LOADING': {
      return { ...state, isLoading: action.payload }
    }

    default:
      return state
  }
}

// Helper function to calculate totals
function calculateTotals(state: CartState): CartState {
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0)
  const totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  const totalSavings = state.items.reduce((total, item) => {
    const savings = item.originalPrice ? (item.originalPrice - item.price) * item.quantity : 0
    return total + savings
  }, 0)

  return {
    ...state,
    itemCount,
    totalAmount,
    totalSavings
  }
}

// Context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Provider component
interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('clayfable-cart')
    if (savedCart) {
      try {
        const parsedCart: CartItem[] = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: parsedCart })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (state.items.length > 0) {
      localStorage.setItem('clayfable-cart', JSON.stringify(state.items))
    } else {
      localStorage.removeItem('clayfable-cart')
    }
  }, [state.items])

  // Actions
  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const getItem = (id: string) => {
    return state.items.find(item => item.id === id)
  }

  const isInCart = (id: string) => {
    return state.items.some(item => item.id === id)
  }

  const value: CartContextType = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItem,
    isInCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// Hook to use cart context
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

// Hook for cart item count (for header badge)
export function useCartCount() {
  const { itemCount } = useCart()
  return itemCount
}