import { css } from '@emotion/core'

import { transitionDuration, offset } from '../constants'

export const rootCss = css`
    flex: 1 1 auto;    
    transition: opacity ${transitionDuration};
    margin: ${offset};
`

export const fadeInCss = css`
    opacity: 1;
`

export const fadeOutCss = css`
    opacity: 0;
`