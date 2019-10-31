import { css, keyframes } from '@emotion/core'

import { offset, transitionDuration } from '../constants'

export const rootCss = css`
    flex: 1 1 auto;
    margin: ${offset}; 
`

const fadeInKf = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`

const fadeOutKf = keyframes`
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
`

export const fadeInCss = css`
    animation-name: ${fadeInKf};
    animation-duration: ${transitionDuration};
    animation-fill-mode: forwards;
    animation-timing-function: ease-in-out;
`

export const fadeOutCss = css`
    animation-name: ${fadeOutKf};
    animation-duration: ${transitionDuration};
    animation-fill-mode: forwards;
    animation-timing-function: ease-in-out;
`