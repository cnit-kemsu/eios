import React from 'react'
import { Link } from '@kemsu/react-routing'
import { Button, Tooltip } from '@kemsu/eios-ui'

import {
    rootCss, dynRootCss, logoContainerCss, usernameContainerCss,
    logoTextCss, dynLogoTextCss, titleContainerCss, usernameItemsCss
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
    username,
    onUsernameClick,
    onLogoutButtonClick,
    height
}) {

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
            <div css={usernameContainerCss}>
                <div css={usernameItemsCss}>
                    {
                        username ? (
                            <>
                                <Button onClick={onUsernameClick} flat transparent borderless colorStyle="primary" style={{ marginRight: '16px' }}>{username}</Button>
                                <div>
                                    <Tooltip text='Выйти' position='bottom'>
                                        <Button onClick={onLogoutButtonClick} flat colorStyle='secondary' transparent borderless><i className='eios-icon eios-icon-exit' style={{ fontSize: '14.4pt' }}></i></Button>
                                    </Tooltip>
                                </div>
                            </>
                        ) : <div style={{ width: '168px', textAlign: 'center' }}>Гость</div>
                    }
                </div>
            </div>
        </header>
    )
}