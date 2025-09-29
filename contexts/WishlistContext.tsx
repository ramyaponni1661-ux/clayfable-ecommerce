"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'

// Types
export interface WishlistItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  inStock: boolean
}

interface WishlistState {
  items: WishlistItem[]
  itemCount: number
  isLoading: boolean
}

type WishlistAction =
  | { type: 'ADD_ITEM'; payload: WishlistItem }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'LOAD_WISHLIST'; payload: WishlistItem[] }
  | { type: 'SET_LOADING'; payload: boolean }

interface WishlistContextType extends WishlistState {
  addItem: (item: WishlistItem) => void
  removeItem: (id: string) => void
  clearWishlist: () => void
  getItem: (id: string) => WishlistItem | undefined
  isInWishlist: (id: string) => boolean
}

// Initial state
const initialState: WishlistState = {
  items: [],
  itemCount: 0,
  isLoading: false,
}

// Reducer function
function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id)

      if (existingItem) {
        // Item already in wishlist, don't add again
        return state
      }

      const newItems = [...state.items, action.payload]
      return {
        ...state,
        items: newItems,
        itemCount: newItems.length
      }
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload.id)
      return {
        ...state,
        items: updatedItems,
        itemCount: updatedItems.length
      }
    }

    case 'CLEAR_WISHLIST': {
      return {
        ...initialState
      }
    }

    case 'LOAD_WISHLIST': {
      return {
        ...state,
        items: action.payload,
        itemCount: action.payload.length
      }
    }

    case 'SET_LOADING': {
      return {
        ...state,
        isLoading: action.payload
      }
    }

    default:
      return state
  }
}

// Context
const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

// Provider component
interface WishlistProviderProps {
  children: ReactNode
}

export function WishlistProvider({ children }: WishlistProviderProps) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState)

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('clayfable-wishlist')
    if (savedWishlist) {
      try {
        const parsedWishlist: WishlistItem[] = JSON.parse(savedWishlist)
        dispatch({ type: 'LOAD_WISHLIST', payload: parsedWishlist })
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error)
      }
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (state.items.length > 0) {
      localStorage.setItem('clayfable-wishlist', JSON.stringify(state.items))
    } else {
      localStorage.removeItem('clayfable-wishlist')
    }
  }, [state.items])

  // Actions
  const addItem = (item: WishlistItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } })
  }

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' })
  }

  const getItem = (id: string) => {
    return state.items.find(item => item.id === id)
  }

  const isInWishlist = (id: string) => {
    return state.items.some(item => item.id === id)
  }

  const value: WishlistContextType = {
    ...state,
    addItem,
    removeItem,
    clearWishlist,
    getItem,
    isInWishlist
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

// Hook to use wishlist context
export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}

// Hook for wishlist item count (for header badge)
export function useWishlistCount() {
  const { itemCount } = useWishlist()
  return itemCount
}