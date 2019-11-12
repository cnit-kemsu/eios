import React from 'react'
import { jsx } from '@emotion/core'
import { Ripple } from '@kemsu/eios-ui'
import { Link } from '@kemsu/react-routing'
import {
    rootCss, copyrightCss, topCss, linkGroupCss, dynLinkGroupCss,
    feedbackInfoCss, contactItemCss, linkIconCss, linkTitleCss, linkCss
} from './style'

import '../../../assets/icons/font-icons/eios-icons/style.css'

export default function Footer({ links = [], contactInfo : { phone, localPhone, email } = {} }) {

    return (
        <footer css={rootCss}>
            <div css={topCss}>
                <div css={[linkGroupCss, dynLinkGroupCss({ hasLinks: links.length > 0 })]}>
                    {
                        links.map(({ url, ext, icon, title }, i) => jsx(ext ? 'a' : Link, {
                            key: i,
                            [ext ? 'href' : 'to']: url,
                            css: linkCss
                        }, (
                            <>
                                <Ripple />
                                <i className={`eios-icon eios-icon-${icon}`} css={linkIconCss}></i>
                                <div css={linkTitleCss}>{title}</div>
                            </>
                        )))
                    }
                </div>
                <div css={feedbackInfoCss}>
                    <div>
                        <h3 style={{ paddingTop: '12.8px' }}>Контакты:</h3>
                        <div css={contactItemCss}><div>Телефон: </div><span>{phone}</span></div>
                        <div css={contactItemCss}><div>Местный телефон: </div><span>{localPhone}</span></div>
                        <div css={contactItemCss}><div>E-mail: </div><a href="mailto:ocpo@kemsu.ru">{email}</a></div>
                    </div>
                </div>
            </div>
            <div css={copyrightCss}>
                <span>
                    &copy; Центр Новых Информационных Технологий (ЦНИТ), КемГУ
                </span>
            </div>
        </footer>
    )
}