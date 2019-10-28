import React from 'react'
import { Link } from '@kemsu/react-routing'

import {
    rootCss, dynRootCss, logoContainerCss,
    logoTextCss, dynLogoTextCss, titleContainerCss
} from './style'



export default function Header({    
    logoSize,
    logoText,
    logoUrl,
    orgUrl,
    orgName,
    title,
    titleUrl,
    subtitle,
    hide,
    height
}) {

    let hasSubtitle = !!subtitle

    return (
        <header css={[rootCss, dynRootCss({ height })]}>
            <div css={logoContainerCss}>
                <Link css={[logoTextCss, dynLogoTextCss({ logoSize })]} to={logoUrl}>
                    <h1>{logoText}</h1>
                </Link>
            </div>
            <div css={titleContainerCss}>
                <div>
                    <a href={orgUrl} style={{ textDecoration: 'none' }}>
                        <div style={{ padding: '0px', fontSize: `12.8px`, color: "#575d6d" }}>{orgName}</div>
                    </a>
                    <h2 style={{ padding: '0px' }}>
                        <Link style={{ textDecoration: 'none', color: "#575d6d" }} to={titleUrl}>
                            {title}
                        </Link>
                        <br />
                        {
                            subtitle && (
                                <span style={{ fontSize: `18.4px`, display: 'block', marginTop: '8px', color: '#2858a9' }}>
                                    {subtitle}
                                </span>
                            )
                        }
                    </h2>
                </div>
            </div>
        </header>
    )
}