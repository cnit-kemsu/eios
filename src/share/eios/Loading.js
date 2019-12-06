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
    flex-direction: row;
    width: 100%;
`

export default function Loading({ loading, spinnerSize, title, titleWidth, children }) {

    if (!loading) return children || null

    return (
        <div css={rootCss}>
            <div css={spinnerContainerCss}>
                <Spinner scale={1} style={{width: spinnerSize}}/>
                <div style={{ textAlign: "center", width: titleWidth, marginLeft: "8px" }}>{title}</div>
            </div>
        </div>
    )
}

Loading.defaultProps = {
    spinnerSize: '20px',
    title: 'Загрузка...'
}
