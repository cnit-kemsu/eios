import React from 'react'
import { Link } from '@kemsu/react-routing'
import { Button } from '@kemsu/eios-ui'

import {
    logoRootCss, logoTextCss, dynLogoTextCss, sidebarRootCss, dynSidebarRootCss, dynLogoRootCss, forumBtnContainerCss,
    sidebarVerticalBlockCss, navCss, navLinkListCss, navLinkCss, navLinkContainerCss, selectedNavLinkContainerCss
} from './style'

export default function Sidebar({ logoText, hide, logoSize, height, links }) {

    return (
        <>
            <div css={[logoRootCss, dynLogoRootCss({ height, hide })]}>
                <Link css={[logoTextCss, dynLogoTextCss({ logoSize })]} to="/">
                    <h1>{logoText}</h1>
                </Link>
            </div>
            <aside css={[sidebarRootCss, dynSidebarRootCss({ height, hide })]}>
                <div css={sidebarVerticalBlockCss}>
                    <nav css={navCss}>
                        <ul css={navLinkListCss}>
                            {links.map(({ selected, url, title, onClick, target, ext }, index) => (
                                <li key={index} css={[navLinkContainerCss, selected ? selectedNavLinkContainerCss : null]}>
                                    {
                                        url ?
                                            ext ?
                                                (<a href={url} target={target} css={navLinkCss}>{title}</a>)
                                                :
                                                (<Link to={url} css={navLinkCss}>{title}</Link>)
                                            :
                                            (<div css={navLinkCss} onClick={onClick}>{title}</div>)
                                    }
                                </li>))}
                        </ul>
                    </nav>
                    <div css={forumBtnContainerCss}>
                        <Button elementType='a' href='http://iais.kemsu.ru/dekanat/forum/index.htm' style={{ width: '115px', height: '35px' }} flat transparent colorStyle={'light'} >Форум</Button>
                    </div>
                </div>
            </aside>
        </>
    )
}