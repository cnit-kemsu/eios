import { css } from '@emotion/core'

import { transitionDuration, offset, logoTxtLtSpc, logoWidth } from '../constants'

export const logoRootCss = css`
    transition: width, font-size, padding, height, background;
    transition-duration: ${transitionDuration};
    position: absolute;
    left: 0px;
    top: 0px;    
    width: ${logoWidth};    
    border: none;    
    display: flex;      
    align-items: center;    
    letter-spacing: ${logoTxtLtSpc};    
    background: rgb(30, 67, 128);
    border-bottom: 1px solid #4C6293;
`

export const dynLogoRootCss = ({ height }) => css`
    height: ${height};
`

export const logoTextCss = css`

    h1 {        
        transition: font-size ${transitionDuration};
        padding: 0px;
        font-weight: normal;
        color: white;
    }

    transition: opacity ${transitionDuration};   
    user-select: none;    
    overflow: hidden;  
    text-decoration: none; 
    margin-left: calc(${logoWidth} / 2 - ${logoTxtLtSpc} * 2 - 2.25rem);
`

export const dynLogoTextCss = ({ logoSize }) => css`
    h1 {
        font-size: ${logoSize};
    }
`

export const sidebarRootCss = css`
    transition: min-height, margin, background;
    transition-duration: ${transitionDuration};
    z-index: 150;
    display: flex;
    margin-left: 0px;
    min-width: ${logoWidth};
    
    background: linear-gradient(to bottom, rgb(30, 67, 128) 0px, rgb(30, 67, 128) 50%, rgb(48, 105, 202) 100%);
`

export const dynSidebarRootCss = ({ height }) => css`
    min-height: calc(100vh - ${height});
`

export const sidebarVerticalBlockCss = css`
    transition: opacity ${transitionDuration};    
    width: ${logoWidth};
    display: flex;
    flex-direction: column;
`

export const navCss = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: ${logoWidth};   
    flex: 1 0 auto;
`

export const navLinkListCss = css`
    text-align: left;
    margin: 0px;
    margin-top: calc(${offset} / 2);
    padding: 0px;
    list-style-type: none;
    position: relative;
    overflow: hidden;
    width: ${logoWidth}; 
`

export const navLinkCss = css`
    text-decoration: none;                    
    display: inline-block;
    width: 100%;    
    padding-top: 6.4px;             
    padding-bottom: 6.4px;
    padding-left: 3.2px;
    padding-right: 25.6px;
    margin-left: 25.6px;
    display: flex;        
    align-items: center;    
    cursor: pointer;

    
`

export const navLinkContainerCss = css`

    a {
        color: white;
    }

    &:hover{
        background: rgba(255, 255, 255, 0.05);
        border-left: 3.2px solid #dc1654;  
        
        & > a{            
            padding-left: 0px;
            padding-right: 25.6px;                 
            color: #e5e5e5;            
        }
    }
`

export const selectedNavLinkContainerCss = css`
    background: rgba(255, 255, 255, 0.05); 
`