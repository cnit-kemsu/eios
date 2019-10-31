import React from 'react'
import { Link } from '@kemsu/react-routing'
import { rootCss } from './style'

export default function Topbar({ links }) {

    return (
        <div css={rootCss}>{links.map(({ title, url }, index) => {
            return <Link key={index} to={url}>{title}</Link>
        })}</div>
    )
}