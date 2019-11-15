import { css } from '@emotion/core'

export const rootCss = css`
    width: 336px;    
`

export const tabContentCss = css`
    padding: 12px;
    border-width: 4px 4px 4px;
    border-style: none solid solid;
    border-color: rgb(220, 227, 236);
`

export const textFieldContainerCss = css`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;        
    margin-top: 0px;   
    margin-bottom: 11.2px;
    
    & > * {
        margin: 6.4px;                    
    }
`

export const submitButtonCss = css`    
    width: 120px;
    height: 32px; 
    border-radius: 16px;
`

export const submitButtonContainerCss = css`
    display: flex;
    flex-direction: row;    
    align-items: center;  
    justify-content: center;
`

export const messageCss = css`
    text-align: center;
    opacity: 0;
    transform: scaleY(0);
    transition: opacity, transform;
    transition-duration:  0.25s;
`

export const showMessageCss = css`
    opacity: 1;
    transform: scaleY(1);
`


