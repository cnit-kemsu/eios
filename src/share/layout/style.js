import { css } from '@emotion/core'


export const globalCss = css`
    
    html, body {
        font-size: 11.2px;
        font-family: Tahoma, Verdana, Segoe, sans-serif;
        width: 100%;
        height: 100%;
        color: #575d6d;
    }

    h1, h2, h3, h4, h5, h6{
        padding: 0px;
        margin: 0px;        
        font-weight: 100;        
    }

    h1 { 
        font-size: 24px; 
        padding-bottom: 24px;
    }

    h2 {
        font-size: 20px;
        padding-bottom: 20px;
    }

    h3 {
        font-size: 16.8px;
        padding-bottom: 16.8px;
    }    

    a {
        color: #575d6d;
    }
`

export const rootCss = css`

    /* prev: injectGlobal */
    

    /* prev: Container */
    min-width: 984px;       
    display: flex;
    flex-direction: column;

    /* prev: injectGlobal */
    
`

export const horizontalBlockCss = css`
    display: flex;
    flex-direction: row;
`

export const verticalBlockCss = css`
    display: flex;
    flex-direction: column;
    width: 100%;
`