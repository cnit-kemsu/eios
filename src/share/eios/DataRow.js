import React from 'react'


export function DataRow({ title, value, content, children, titleStyle, contentStyle, style }) {

    const c = value || content || children

    return c ?
        (<div style={{ padding: '6px 0px', ...style }}>
            <span style={{ width: '230px', display: 'inline-block', fontWeight: 'bold', ...titleStyle }}>{title}: </span>
            <span style={contentStyle}>{c}</span>
        </div>) : null
}

DataRow.defaultProps = {
    style: {},
    titleStyle: {},
    contentStyle: {}
}