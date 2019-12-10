import React, { memo } from 'react'

//import { useFadeTransition } from 'share/hooks'

import { rootCss/*, fadeInCss, fadeOutCss*/ } from './style'

export default memo(function AppContent({ contentTitle, children }) {

    /*const contentTransitionProps = useFadeTransition((
        <>
            {contentTitle && <h1>{contentTitle}</h1>}
            {children}
        </>
    ), fadeInCss, fadeOutCss, rootCss, true, [contentTitle, children.type])

    return (
        <main {...contentTransitionProps} />
    )*/    

    return (
        <div css={rootCss}>
            {contentTitle && <h1>{contentTitle}</h1>}
            {children}
        </div>
    )
})