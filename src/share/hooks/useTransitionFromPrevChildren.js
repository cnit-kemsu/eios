import { useState, useCallback, useEffect } from 'react'
import { usePrevious } from './usePrevious'
import { toArray } from '../utils'



export function useTransitionFromPrevChildren(children, fadeInEmotionCss, fadeOutEmotionCss, emotionCss, isTransition = true) {

    const [transitionChildren, setTransitionContent] = useState(null)
    const prevContent = usePrevious(children)
    const onTransitionEnd = useCallback(() => setTransitionContent(null), [setTransitionContent])

    const contentChanged = prevContent !== undefined && prevContent.type !== children.type

    useEffect(() => {

        if (contentChanged && !transitionChildren) {
            setTransitionContent(prevContent)
        }

    }, [contentChanged])

    const targetChildren = contentChanged || transitionChildren ? transitionChildren || prevContent : children
    const css = [...toArray(emotionCss), contentChanged || transitionChildren ? fadeOutEmotionCss : fadeInEmotionCss]

    return { [isTransition ? 'onTransitionEnd' : 'onAnimationEnd']: transitionChildren || contentChanged ? onTransitionEnd : undefined, children: targetChildren, css }
}