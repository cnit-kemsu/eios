import React from 'react'

import Header from './Header'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import AppContent from './AppContent'
import Footer from './Footer'

import { rootCss, horizontalBlockCss, verticalBlockCss } from './style'
import { bigHeaderHeight, smallHeaderHeight, bigLogoSize, smallLogoSize } from './constants'



export default function Layout({    
    logoText,
    logoUrl,
    orgUrl,
    orgName,
    title,
    titleUrl,
    subtitle,
    hideSidebar,
    topbarLinks,
    sidebarLinks,
    children
}) {

    const headerHeight = subtitle ? bigHeaderHeight : smallHeaderHeight
    const logoSize = subtitle ? bigLogoSize : smallLogoSize  
    

    return (
        <div css={rootCss}>
            <Header logoSize={logoSize} logoText={logoText} logoUrl={logoUrl} orgUrl={orgUrl} orgName={orgName} title={title} titleUrl={titleUrl} subtitle={subtitle} height={headerHeight} />
            <div css={horizontalBlockCss}>
                <Sidebar logoText={logoText} logoSize={logoSize} hide={hideSidebar} height={headerHeight} links={sidebarLinks} />
                <div css={verticalBlockCss}>
                    <Topbar links={topbarLinks} />
                    <AppContent>{children}</AppContent>
                    <Footer />
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