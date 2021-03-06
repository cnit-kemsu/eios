import { css } from '@emotion/core'
import { borderColor, transitionDuration, logoWidth, logoTxtLtSpc } from '../constants'


export const rootCss = css`    
    display: flex;
    flex-direction: row;
    flex: 0 0 auto;
    border-bottom: 1px solid ${borderColor};
    transition: height ${transitionDuration};
    overflow: hidden;
`

export const dynRootCss = ({ height }) => css`
    height: ${height};
`

export const logoContainerCss = css`
    flex: 0 0 ${logoWidth};
    width: ${logoWidth};
    border: none;
    border-right: 1px solid ${borderColor}; 
    display: flex;
    justify-content: center;    
    align-items: center;
    overflow: hidden;        
    letter-spacing: ${logoTxtLtSpc};    
    transition-property: font-size, padding;
`

export const logoTextCss = css`
    a& {
        h1 {
            transition: font-size ${transitionDuration};        
            padding: 0px;
            font-weight: normal;
        }

        width: 212px;
        text-align: center;

        color: #2858a9;    
        user-select: none;    
        text-decoration: none;
    }
`

export const dynLogoTextCss = ({ logoSize }) => css`
    h1 {
        font-size: ${logoSize};
    }
`

export const titleContainerCss = css`
    flex: 1 1 auto;
    justify-content: flex-start;  
    border-right: 1px solid ${borderColor};  
    margin-left: 56px;
    align-items: center;
    display: flex;
`

export const usernameContainerCss = css`
    display: flex;
    align-items: center;
    justify-content: center;     
    
`

export const usernameItemsCss = css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    margin: 0px 25.6px;
`