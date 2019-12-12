import { useState, useEffect, useRef, useReducer } from 'react'

export function useAsync(asyncFn, initialState, deps) {

    const [loading, setLoading] = useState(false)
    const [value, set] = useState(initialState)
    const [error, setError] = useState()

    const unmountFlag = useRef(false)

    useEffect(() => {
        return () => unmountFlag.current = true
    }, [])

    useEffect(() => {



        (async () => {
            try {
                setLoading(true)

                const r = await asyncFn()

                if (unmountFlag.current) return

                set(r)
                setLoading(false)
            } catch (err) {
                setError(error)
            }
        })()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)

    return { value, loading, error, set }
}

export function useReducerAsync(asyncFn, reducer, initialState, deps) {

    const [loading, setLoading] = useState(false)
    const [value, set] = useReducer(reducer, initialState)
    const [error, setError] = useState()

    const unmountFlag = useRef(false)

    useEffect(() => {
        return () => unmountFlag.current = true
    }, [])

    useEffect(() => {

        (async () => {
            try {
                setLoading(true)

                const r = await asyncFn()

                if (unmountFlag.current) return

                set(r)
                setLoading(false)
            } catch (err) {
                setError(error)
            }
        })()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)

    return { value, loading, error, set }
}