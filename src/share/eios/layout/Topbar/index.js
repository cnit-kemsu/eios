import React from 'react'
import { Link } from '@kemsu/react-routing'
import { rootCss, dynRootCss, linkCss, fadeInLinkCss, fadeOutLinkCss } from './style'

import { usePrevious } from 'share/hooks'


function getMatchesNumber(prev = [], cur) {
    let minLength = Math.min(prev.length, cur.length)
    let i = 0

    for (; i < minLength && prev[i].url === cur[i].url; ++i);

    return i
}

export default function Topbar({ links, hide, additionalInfo }) {

    const prevLinks = usePrevious(links)

    const linkMatchesNumber = getMatchesNumber(prevLinks, links)

    const targetLinks = prevLinks ?.length > links.length ? prevLinks : links
    const fadeInTail = links.length >= (prevLinks ?.length || 0)

    return (
        <div css={[rootCss, dynRootCss({ hide })]}>
            <nav css={linkCss}>
                {targetLinks.map(({ title, url, ext }, index) => {

                    const isLastLink = index === links.length - 1

                    return (
                        <span key={index} css={index >= linkMatchesNumber ? (fadeInTail ? fadeInLinkCss : fadeOutLinkCss) : undefined}>
                            {index !== 0 && <span>/</span>}
                            {ext ? <a data-is-last-link={isLastLink} href={url}>{title}</a> : <Link data-is-last-link={isLastLink} to={url}>{title}</Link>}
                        </span>
                    )
                })}
            </nav>
            <div>
                {additionalInfo}
            </div>
        </div>
    )
}
