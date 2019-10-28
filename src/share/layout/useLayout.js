import { useState, useEffect } from 'react'

let cachedLayoutProps = null

export function useLayout(layoutProps) {    

    const [, forceUpdate] = useState({})    

    useEffect(() => {
        if (cachedLayoutProps) {            
            cachedLayoutProps = null
            forceUpdate({})
        }

        return () => cachedLayoutProps = layoutProps

    }, [])

    return cachedLayoutProps ? { ...cachedLayoutProps, hideChildren: true } : layoutProps
}