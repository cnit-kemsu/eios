import React from 'react'
import { css } from '@emotion/core'
import { Spinner } from '@kemsu/eios-ui'


const rootCss = css`
    display: flex;
    justify-content: center;
`

const spinnerContainerCss = css`    
    display: flex;
    align-items: center;
    flex-direction: column;
`

export default function Loading({ loading, spinnerSize, title, titleWidth, children }) {

    if (!loading) return children || null

    return (
        <div css={rootCss}>
            <div css={spinnerContainerCss} style={{ width: spinnerSize }}>
                <Spinner />
                <div style={{ textAlign: "center", width: titleWidth }}>{title}</div>
            </div>
        </div>
    )
}

Loading.defaultProps = {
    spinnerSize: '100px',
    title: 'Загрузка...'
}
