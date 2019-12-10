import React from 'react'
import { Link } from '@kemsu/react-routing'
import { Tooltip } from '@kemsu/eios-ui'
import { css } from '@emotion/core'

export const dynLinkCss = ({ showAsSublinks }) => css`
    display: inline-block;
    padding: 4.8px;
    padding-left: 0px;
    text-decoration: none;    
    color: #575d6d;
    transition: color 0.5s;
    cursor: pointer;   
    font-size: ${showAsSublinks ? 'inherit' : '12.8px'};
    
    &:hover {
        color: rgb(105, 112, 132);
        text-decoration: underline;
    }
`

export const parentLinksCss = css`    
    width: 800px;
`

export default function LinkList({ links, showAsSublinks }) {

    const linkList = links.filter(link => !!link)

    return (
        <div css={showAsSublinks ? parentLinksCss : undefined}>
            {
                linkList.map((link, i) => (
                    <div css={link.css} style={{ marginLeft: showAsSublinks ? '16px' : '0px' }} key={i}>
                        <span style={{ marginRight: '9.6px' }}>{showAsSublinks ? '—' : `${i + 1}.`}</span>
                        <Tooltip position="right" text={link.contact && `Контакты: ${link.contact}`}>
                            {
                                link.url ?
                                    (
                                        link.ext ?
                                            (
                                                <a target={link.target} css={dynLinkCss({ showAsSublinks })} href={link.url}>{link.title}</a>
                                            )
                                            :
                                            (
                                                <Link target={link.target} css={dynLinkCss({ showAsSublinks })} to={link.url}>{link.title}</Link>
                                            )
                                    )
                                    :
                                    (
                                        <div css={dynLinkCss({ showAsSublinks })}>{link.title}</div>
                                    )
                            }
                        </Tooltip>
                        {
                            link.sublinks && <LinkList links={link.sublinks} showAsSublinks />
                        }

                    </div>
                ))
            }
        </div>
    );
}

