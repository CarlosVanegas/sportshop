"use client"

// Inspired by react-hot-toast library
import { useState, useEffect, useCallback } from "react"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

let count = 0

function generateId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER
    return count.toString()
}

export const toastTimeouts = new Map()

const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST",
}

const listeners = []

let memoryState = { toasts: [] }

function dispatch(action) {
    memoryState = reducer(memoryState, action)
    listeners.forEach((listener) => {
        listener(memoryState)
    })
}

function reducer(state, action) {
    switch (action.type) {
        case actionTypes.ADD_TOAST:
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
            }

        case actionTypes.UPDATE_TOAST:
            return {
                ...state,
                toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
            }

        case actionTypes.DISMISS_TOAST: {
            const { id } = action

            // ! Side effects ! - This could be extracted into a dismissToast() action,
            // but I'll keep it here for simplicity
            if (toastTimeouts.has(id)) {
                clearTimeout(toastTimeouts.get(id))
                toastTimeouts.delete(id)
            }

            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === id || id === undefined
                        ? {
                            ...t,
                            open: false,
                        }
                        : t,
                ),
            }
        }
        case actionTypes.REMOVE_TOAST:
            if (action.id === undefined) {
                return {
                    ...state,
                    toasts: [],
                }
            }
            return {
                ...state,
                toasts: state.toasts.filter((t) => t.id !== action.id),
            }

        default:
            return state
    }
}

function useToastStore(initialState = memoryState) {
    const [state, setState] = useState(initialState)

    useEffect(() => {
        listeners.push(setState)
        return () => {
            const index = listeners.indexOf(setState)
            if (index > -1) {
                listeners.splice(index, 1)
            }
        }
    }, [state])

    return state
}

export function toast(props) {
    const id = props.id || generateId()

    const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, id })
    const update = (props) =>
        dispatch({
            type: actionTypes.UPDATE_TOAST,
            toast: { ...props, id },
        })

    dispatch({
        type: actionTypes.ADD_TOAST,
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open) => {
                if (!open) {
                    dismiss()
                }
            },
        },
    })

    // This will set up automatic dismissal of the toast after TOAST_REMOVE_DELAY
    if (props.duration !== Number.POSITIVE_INFINITY) {
        const timeout = setTimeout(() => {
            dismiss()
        }, props.duration || TOAST_REMOVE_DELAY)

        toastTimeouts.set(id, timeout)
    }

    return {
        id,
        dismiss,
        update,
    }
}

export function useToast() {
    const state = useToastStore()

    const dismiss = useCallback((toastId) => {
        dispatch({ type: actionTypes.DISMISS_TOAST, id: toastId })
    }, [])

    const dismissAll = useCallback(() => {
        dispatch({ type: actionTypes.DISMISS_TOAST })
    }, [])

    return {
        ...state,
        toast,
        dismiss,
        dismissAll,
    }
}
