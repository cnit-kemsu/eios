import { css } from '@emotion/core'

import { transitionDuration, offset, logoTxtLtSpc, logoWidth } from '../constants'

export const logoRootCss = css`
    transition: width, font-size, padding, height;
    transition-duration: ${transitionDuration};
    position: absolute;
    left: 0px;
    top: 0px;       
    border: none;    
    display: flex;      
    align-items: center;    
    letter-spacing: ${logoTxtLtSpc};    
    border-bottom: 1px solid #4C6293;
    overflow: hidden;
`

export const dynLogoRootCss = ({ height, hide, logoBackground, border }) => css`
    height: ${height};
    width: ${hide ? '0px' : logoWidth}; 
    background: ${logoBackground ? logoBackground : 'rgb(30, 67, 128)'};
    border-bottom: ${border ? border : '1px solid #4C6293'};
`

export const logoTextCss = css`
    a& {
        h1 {        
            transition: font-size ${transitionDuration};
            padding: 0px;
            font-weight: normal;            
        }
        
        position: absolute;
        width: ${logoWidth};
        text-align: center;
        transition: opacity ${transitionDuration};   
        user-select: none;    
        overflow: hidden;  
        text-decoration: none;  
    }
`

export const dynLogoTextCss = ({ logoSize, logoColor }) => css`
    h1 {
        font-size: ${logoSize};
        color: ${logoColor ? logoColor : 'white'};
    }
`

export const sidebarRootCss = css`
    transition: min-height, margin, background;
    transition-duration: ${transitionDuration};
    z-index: 150;
    display: flex;    
    min-width: ${logoWidth};    
    background: linear-gradient(to bottom, rgb(30, 67, 128) 0px, rgb(30, 67, 128) 50%, rgb(48, 105, 202) 100%);
`

export const dynSidebarRootCss = ({ height, hide, sidebarBackground }) => css`
    min-height: calc(100vh - ${height});
    margin-left: ${hide ?  `-${logoWidth}` : '0px'};
    background: ${sidebarBackground ? sidebarBackground : 'linear-gradient(to bottom, rgb(30, 67, 128) 0px, rgb(30, 67, 128) 50%, rgb(48, 105, 202) 100%)'};
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

    &:hover{
        background: rgba(255, 255, 255, 0.05);
        border-left: 3.2px solid #dc1654;  
        
        & > div, a{            
            padding-left: 0px;
            padding-right: 25.6px;                                      
        }
    }
`

export const dynNavLinkContainerCss = ({ navItemColor, navItemHoverColor}) => css`

    div, a {
        color: ${navItemColor ? navItemColor : 'white'};
    }

    &:hover{
        background: rgba(255, 255, 255, 0.05);
        border-left: 3.2px solid #dc1654;  
        
        & > div, a{                                         
            color: ${navItemHoverColor ? navItemHoverColor : '#e5e5e5'};
        }
    }
`

export const selectedNavLinkContainerCss = css`
    background: rgba(255, 255, 255, 0.05); 
`

export const forumBtnContainerCss = css`
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-bottom: 36px; 
`

export const backButtonContainerCss = css`
    display: flex;
    align-items: center;
    height: 64.8px;
`