import { css } from '@emotion/core'


export const rootCss = css`
    display: flex;
    flex-direction: row;    

    @media (max-width: 1200px) {
        flex-direction: column;     
        align-items: center;
    }
`

export const colCss = css`
    flex: 1 1.5 auto;
`

export const dblColCss =  css`
    flex: 1 1 auto;    

    @media (max-width: 1200px) {
        margin-left: 0px;
        width: 85%;
    }
`

export const leftColImageContainerCss = css`
    img {
        width: 100%;        
    }

    @media (max-width: 1200px) {
        text-align: center;        
        margin-bottom: 11.2px;
        
        img {
            width: 416px
        }
    }
`

export const loginFormRowCss = css`
    display: flex;
    flex-direction: row;   
    margin-top: 3vw;

    @media (max-width: 1200px) {
        margin-top: 28px;        
    }

`

export const infoContainerCss = css`
    text-align: justify; 
    margin-left: 3vw;
    max-width: 800px;    
    min-height: 400px;

    @media (max-width: 1200px) {
        min-height: 280px;
    }
`