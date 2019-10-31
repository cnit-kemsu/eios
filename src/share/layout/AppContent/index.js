import React, { useState, useCallback } from 'react'

import { usePrevious } from '../../hooks'
import { rootCss, fadeInCss, fadeOutCss } from './style'

export default function AppContent({ children }) {

    const prevChildren = usePrevious(children)
    const [, forceUpdate] = useState({})
    const animationEndHanlder = useCallback(() => forceUpdate({}), [forceUpdate])

    const contentChanged = prevChildren !== undefined && prevChildren.type !== children.type       

    return (
        <main onAnimationEnd={!contentChanged ? undefined : animationEndHanlder} css={[rootCss, !contentChanged ? fadeInCss : fadeOutCss]}>{!contentChanged ? children : prevChildren}</main>
    )
}