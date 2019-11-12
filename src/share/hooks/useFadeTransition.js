import { useState, useCallback, useEffect } from 'react'
import { usePrevious } from './usePrevious'
import { toArray } from '../utils'



export function useFadeTransition(content, fadeInEmotionCss, fadeOutEmotionCss, emotionCss, isTransition = true) {

    const [transitionChildren, setTransitionContent] = useState(null)
    const prevContent = usePrevious(content)
    const onTransitionEnd = useCallback(() => setTransitionContent(null), [setTransitionContent])

    const contentChanged = prevContent !== undefined && prevContent.type !== content.type

    useEffect(() => {

        if (contentChanged && !transitionChildren) {
            setTransitionContent(prevContent)
        }

    }, [contentChanged])

    const targetChildren = contentChanged || transitionChildren ? transitionChildren || prevContent : content
    const css = [...toArray(emotionCss), contentChanged || transitionChildren ? fadeOutEmotionCss : fadeInEmotionCss]

    return { [isTransition ? 'onTransitionEnd' : 'onAnimationEnd']: transitionChildren || contentChanged ? onTransitionEnd : undefined, children: targetChildren, css }
}