import { useState, useCallback, useEffect } from 'react'
import { usePrevious } from './usePrevious'
import { toArray } from '../utils'



export function useFadeTransition(content, fadeInEmotionCss, fadeOutEmotionCss, emotionCss, isTransition = true, contentChangeSigns = null) {    

    const [transitionContent, setTransitionContent] = useState(null)
    const prevContent = usePrevious(content)
    const prevContentChangeSigns = usePrevious(contentChangeSigns)
    const onTransitionEnd = useCallback(() => setTransitionContent(null), [])

    let contentChanged = prevContent !== undefined

    if (contentChangeSigns) {
        if (prevContentChangeSigns) {
            contentChanged = contentChanged && contentChangeSigns.some((sign, i) => prevContentChangeSigns[i] !== sign)
        }
    } else {
        contentChanged = contentChanged && prevContent.type !== content.type
    }

    useEffect(() => {

        if (contentChanged && !transitionContent) {
            setTransitionContent(prevContent)
        }

    }, [contentChanged, prevContent, transitionContent])

    const targetChildren = contentChanged || transitionContent ? transitionContent || prevContent : content
    const css = [...toArray(emotionCss), contentChanged || transitionContent ? fadeOutEmotionCss : fadeInEmotionCss]

    return { [isTransition ? 'onTransitionEnd' : 'onAnimationEnd']: transitionContent || contentChanged ? onTransitionEnd : undefined, children: targetChildren, css }
}