import React, { useState, useEffect, useRef } from 'react'
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

export default function Loading({ loading, spinnerSize, title, titleWidth, delay, children, ...props }) {

    const timerId = useRef()
    const [show, setShow] = useState(delay === 0 ? true : false)

    useEffect(() => {        
        
        if (loading) timerId.current = setTimeout(() => setShow(true), delay * 1000)
        else if(timerId.current) clearTimeout(timerId.current)

        return () => timerId.current && clearTimeout(timerId.current)

    }, [delay, loading])

    if (!loading) return children || null

    if (!show) return null

    return (
        <div css={rootCss} {...props}>
            <div css={spinnerContainerCss}>
                <Spinner scale={1} style={{ width: spinnerSize }} />
                <div style={{ textAlign: "center", width: titleWidth, marginLeft: "8px" }}>{title}</div>
            </div>
        </div>
    )
}

Loading.defaultProps = {
    spinnerSize: '20px',
    title: 'Загрузка...',
    delay: 0
}
