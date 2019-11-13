import { css } from '@emotion/core'
import { offset, transitionDuration } from '../constants'


export const rootCss = css`
    z-index: 0;
    display: flex;
    flex-direction: column;
    border-top: 1px solid rgb(220, 227, 236);
`

export const copyrightCss = css`
    display: flex;                      
    justify-content: center;
    align-items: flex-start;    
    height: 52px;    
    border-top: 1px solid rgb(220, 227, 236);
    overflow: hidden;    
    padding-bottom: 24px;
    transition-property: background;  

    span {
        margin-top: 20px;
        text-decoration: none;      
        color: #575d6d;
    }
`

export const topCss = css`
    display: flex;     
    justify-content: space-between;
`

export const linkGroupCss = css`
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 2px;
    margin-left: ${offset};   
    transition: flex, opacity, height;
    transition-duration: ${transitionDuration};    
    
    overflow: hidden;  
`

export const dynLinkGroupCss = ({ hasLinks }) => css`    
    height: ${hasLinks ? '130px' : '0px'};
    opacity: ${hasLinks ? '1' : '0'};    
    flex: ${hasLinks ? '1' : '0'} 0 auto;    
`

export const linkCss = css`
    user-select: none;
    min-width: 120px;    
    max-width: 120px;
    height: 104px;
    border: 2px solid #c6d2e8;    
    cursor: pointer;
    text-decoration: none;
    text-align: center;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px 9.6px;    

    &:hover {
        background: #e8f0fb;
    }

    &:not(:first-of-type){
        border-left: none;
    }
`

export const linkTitleCss = css`
    display: inline-block;  
    color: #575d6d;
`

export const linkIconCss = css`
    i& {
        margin-top: 8px;
        margin-bottom: 12px;    
        color: #dc1654;
        width: 25.6px;
        height: 25.6px;
        font-size: 25.6px;
    }
`

export const feedbackInfoCss = css`
    align-items: flex-end;
    background: white;
    display: flex;
    flex-direction: row;                         
    flex: 0 0 auto;
    overflow: hidden;  
    padding-right: ${offset};  
    transition: margin ${transitionDuration};
`

export const contactsCss = css`
    padding-bottom: 12.8px;    
    margin-left: ${offset};
`

export const contactItemCss = css`
    & > * { 
        font-size: 11.2px;          
    }    

    margin-bottom: 3.2px;

    & > span {
        color: #575d6d;

        & + span, & + a {
            color: #2858a9;
        }
    }
`