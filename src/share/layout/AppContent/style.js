import { css } from '@emotion/core'

import { offset, transitionDuration } from '../constants'

export const rootCss = css`
    flex: 1 1 auto;
    margin: ${offset}; 
    transition: opacity ${transitionDuration};
`

export const fadeInCss = css`
    opacity: 1;
`

export const fadeOutCss = css`
    opacity: 0;
`