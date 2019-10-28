import { css } from '@emotion/core'

import { borderColor, transitionDuration, offset } from '../constants'

export const rootCss = css`
    transition: height, opacity;
    transition-duration: ${transitionDuration};
    height: 38.4px;
    z-index: 50;    
    display: flex;
    justify-content: space-between;
    background: #f9fafe;
    padding-left: ${offset};
    align-items: center;
    flex: 0 0 auto;
    overflow: hidden;  
    border-bottom: 1px solid ${borderColor}; 
`