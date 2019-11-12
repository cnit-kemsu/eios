import { css, keyframes } from '@emotion/core'

import { borderColor, transitionDuration, offset } from '../constants'

export const rootCss = css`
    transition: height, opacity;
    transition-duration: ${transitionDuration};    
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

export const dynRootCss = ({ hide }) => css`
    opacity: ${hide ? '0' : '1'};
    height: ${hide ? '0px' : '38.4px'};
`

export const linkCss = css`
    & span > * {
        margin-right: 3.2px;
        text-decoration: none;                 
        font-size: 11.2px;
    }

    & a[data-is-last-link='true'] {       
            color: black;
    }

    & a:hover {
        color: #4C6293;
    } 
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

export const fadeInLinkCss = css`
    animation: ${fadeInKf} ${transitionDuration} forwards;
`

export const fadeOutLinkCss = css`
    animation: ${fadeOutKf} ${transitionDuration} forwards;    
`