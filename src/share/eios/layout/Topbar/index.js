import React, {memo} from 'react'
import { Spinner } from '@kemsu/eios-ui'
import { Link } from '@kemsu/react-routing'
import { rootCss, dynRootCss, linkCss, fadeInLinkCss, fadeOutLinkCss } from './style'

import { usePrevious } from 'share/hooks'


function getMatchesNumber(prev = [], cur) {
    let minLength = Math.min(prev.length, cur.length)
    let i = 0

    for (; i < minLength && prev[i].title === cur[i].title; ++i);

    return i
}

function compareLinks(a, b) {

    if(a === b) return true

    if(a === undefined && b !== undefined || a !== undefined && b === undefined ) return false

    if(a.length !== b.length) return false

    for(let i=0; i<a.length; ++i) {
        
        const ai = a[i]
        const bi = b[i]

        if(ai.url !== bi.url || ai.title != bi.title) return false
    }
    
    return true
}

const Navigation = memo(({ links }) => {    

    const prevLinks = usePrevious(links)
    const linkMatchesNumber = getMatchesNumber(prevLinks, links)

    const targetLinks = prevLinks ?.length > links.length ? prevLinks : links
    const fadeInTail = links.length >= (prevLinks ?.length || 0)    

    return (
        <>
            {targetLinks.map(({ title, url, ext }, index) => {

                const isLastLink = index === links.length - 1

                return (
                    <span key={title} css={index >= linkMatchesNumber ? (fadeInTail ? fadeInLinkCss : fadeOutLinkCss) : undefined}>
                        {index !== 0 && <span>//</span>}
                        {ext ? <a data-is-last-link={isLastLink} href={url}>{title}</a> : <Link data-is-last-link={isLastLink} to={url}>{title}</Link>}
                    </span>
                )
            })}
        </>
    )

}, (prev, next) => compareLinks(next.links, prev.links))

export default memo(function Topbar({ links, hide, additionalInfo, loading }) {        

    return (
        <div css={[rootCss, dynRootCss({ hide })]}>
            <nav css={linkCss}>
                <Navigation links={links}/>
                <span style={{ paddingLeft: '1em' }}>
                    {loading && <Spinner colorStyle='secondary' style={{ width: '0.8em' }} />}
                </span>
            </nav>
            <div>
                <div style={{ marginRight: '28px' }}>
                    <div style={{ textDecoration: 'none', fontSize: '13.6px' }}>{additionalInfo}</div>
                </div>
            </div>
        </div>
    )
}, (prev, next) => {

    return compareLinks(prev.links, next.links) && prev.hide === next.hide 
    && prev.additionalInfo === next.additionalInfo && prev.loading === next.loading

})
