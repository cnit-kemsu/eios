import React from 'react'


export function DataRow({ title, value }) {
    return value ?
        (<div style={{ padding: '6px 0px' }}>
            <span style={{ width: '230px', display: 'inline-block', fontWeight: 'bold' }}>{title}: </span>
            <span>{value}</span>
        </div>) : null
}
