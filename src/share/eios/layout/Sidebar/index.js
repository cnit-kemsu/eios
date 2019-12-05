import React from 'react'
import { Link } from '@kemsu/react-routing'
import { Button } from '@kemsu/eios-ui'

import {
    logoRootCss, logoTextCss, dynLogoTextCss, sidebarRootCss, dynSidebarRootCss, dynLogoRootCss, forumBtnContainerCss,
    sidebarVerticalBlockCss, navCss, navLinkListCss, navLinkCss, navLinkContainerCss, selectedNavLinkContainerCss,
    backButtonContainerCss
} from './style'

export default function Sidebar({ logoText, hide, logoSize, height, links, backUrl }) {

    const enableBackButton = location.pathname.split('/').length > 2

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
                        <div css={backButtonContainerCss}>
                            <Button style={{
                                width: '92px',
                                height: '28px',
                                borderRadius: '14.4px'
                            }} flat fillable transparent colorStyle="light" elementType={Link} to={backUrl || location.pathname.split('/').slice(0,-1).join('/') || "/"}>Назад</Button>
                        </div>
                    </nav>
                    <div css={forumBtnContainerCss}>
                        <Button disabled={!enableBackButton} elementType='a' href='http://iais.kemsu.ru/dekanat/forum/index.htm' style={{ width: '115px', height: '35px' }} flat transparent colorStyle={'light'} >Форум</Button>
                    </div>
                </div>
            </aside>
        </>
    )
}