import { useState, useCallback, useEffect } from 'react'
import { usePrevious } from './usePrevious'
import { toArray } from '../utils'



export function useFadeTransition(content, fadeInEmotionCss, fadeOutEmotionCss, emotionCss, isTransition = true) {

    const [transitionContent, setTransitionContent] = useState(null)
    const prevContent = usePrevious(content)
    const onTransitionEnd = useCallback(() => setTransitionContent(null), [setTransitionContent])

    const contentChanged = prevContent !== undefined && prevContent.type !== content.type

    useEffect(() => {

        if (contentChanged && !transitionContent) {
            setTransitionContent(prevContent)
        }

    }, [contentChanged])

    const targetChildren = contentChanged || transitionContent ? transitionContent || prevContent : content
    const css = [...toArray(emotionCss), contentChanged || transitionContent ? fadeOutEmotionCss : fadeInEmotionCss]

    return { [isTransition ? 'onTransitionEnd' : 'onAnimationEnd']: transitionContent || contentChanged ? onTransitionEnd : undefined, children: targetChildren, css }
}