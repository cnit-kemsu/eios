import React, { useState, useCallback } from 'react'
import { FloatingActionButton, TextField } from 'material-ui'
import { css } from '@emotion/core'

import ContentAdd from 'material-ui/svg-icons/content/add';
import ActionDelete from 'material-ui/svg-icons/action/delete';

import Loading from '../Loading'


const rootCss = css`
    display: flex;
    align-items: center;
`

function convert(allItems, bindings, filterStr) {

    allItems = allItems.map(software => {

        software.binding = bindings.some(({ Id }) => software.Id === Id)

        return software
    })

    allItems.sort((a, b) => {
        if (!a.binding && b.binding) return 1
        if (a.binding && !b.binding) return -1
        return 0
    })

    if (filterStr) allItems = allItems.filter(({ Name }) => Name.toLowerCase().includes(filterStr.toLowerCase()))

    return allItems
}

export default function BindingForm({ bindingProcess, loading, bindTooltip, unbindTooltip, bind, unbind, items, bindings }) {

    const [filterStr, setFilterStr] = useState()

    const handleChangeFilterStr = useCallback((e, v) => setFilterStr(v.trim()), [])

    return (
        <>

            <br />

            <TextField value={filterStr} placeholder="Фильтр по названию" onChange={handleChangeFilterStr} />

            <br /><br />

            {!loading ? (
                convert(items, bindings, filterStr).map(({ Id, Name, binding }, i) => (
                    <React.Fragment key={i}>
                        {i > 0 ? <hr /> : null}
                        <div className={rootCss}>
                            <span style={{ marginRight: "8px" }}>{Name}</span>
                            <FloatingActionButton disabled={bindingProcess} onClick={!binding ? bind(Id) : unbind(Id)} title={!binding ? bindTooltip : unbindTooltip} mini={true} secondary={binding}>
                                {binding ? <ActionDelete /> : <ContentAdd />}
                            </FloatingActionButton>
                        </div>
                    </React.Fragment>
                ))
            ) : <Loading />}
        </>
    )
}