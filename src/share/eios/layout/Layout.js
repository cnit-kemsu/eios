import React from 'react'

import Header from './Header'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import AppContent from './AppContent'
import Footer from './Footer'

import { globalCss, rootCss, horizontalBlockCss, verticalBlockCss } from './style'
import { bigHeaderHeight, smallHeaderHeight, bigLogoSize, smallLogoSize } from './constants'
import { Global } from '@emotion/core'



export default function Layout({
    logoText,
    logoUrl,
    orgUrl,
    orgName,
    title,
    titleUrl,
    subtitle,
    hideSidebar,
    hideTopbar,
    topbarLinks,
    sidebarLinks,
    footerLinks,
    footerContactInfo,
    topbarAdditionalInfo,
    username,
    onUsernameClick,
    onLogoutButtonClick,
    children
}) {

    const headerHeight = subtitle ? bigHeaderHeight : smallHeaderHeight
    const logoSize = subtitle ? bigLogoSize : smallLogoSize


    return (
        <div css={rootCss}>
            <Global styles={globalCss} />
            <Header
                onUsernameClick={onUsernameClick} onLogoutButtonClick={onLogoutButtonClick} username={username}
                logoSize={logoSize} logoText={logoText} logoUrl={logoUrl} orgUrl={orgUrl}
                orgName={orgName} title={title} titleUrl={titleUrl} subtitle={subtitle} height={headerHeight} />
            <div css={horizontalBlockCss}>
                <Sidebar logoText={logoText} logoSize={logoSize} hide={hideSidebar} height={headerHeight} links={sidebarLinks} />
                <div css={verticalBlockCss}>
                    <Topbar additionalInfo={topbarAdditionalInfo} hide={hideTopbar} links={topbarLinks} />
                    <AppContent>{children}</AppContent>
                    <Footer contactInfo={footerContactInfo} links={footerLinks} />
                </div>
            </div>
        </div>
    )
}

Layout.defaultProps = {
    logoText: 'ЭИОС',
    logoUrl: '/',
    orgUrl: 'https://kemsu.ru',
    orgName: 'Кемеровский государственный университет',
    title: 'Электронная информационно-образовательная среда',
    titleUrl: '/',
    hideSidebar: false,
    topbarLinks: [],
    sidebarLinks: []
}