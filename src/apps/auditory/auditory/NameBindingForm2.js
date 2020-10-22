import React, {useCallback, useState, useEffect, Fragment} from 'react'
import { FloatingActionButton, RaisedButton, MenuItem, SelectField } from 'material-ui'
import ActionDelete from 'material-ui/svg-icons/action/delete';
import { css } from '@emotion/core'

import {
    Table,
    TableBody,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table'

import { fetchDevApi as fetchApi} from 'share/utils'

import Loading from '../Loading'



const messageCss = css`
    background: #e6e6a2;
    margin: 1em;
    padding: 0.5em;
    color: #29280c;
    font-family: Roboto, sans-serif;
`


async function getRows(name) {

    let response = await fetchApi(`auditory/${name}`, {
        method: 'get'
    })

    let json = await response.json()

    return json.result

}


export default function NameBindingForm({ auditoryId }) {

    const [denomination, setDenomination] = useState()
    const [denominations, setDenominations] = useState([])
    const [purpose, setPurpose] = useState()
    const [purposes, setPurposes] = useState([])
    const [bindings, setBindings] = useState([])

    const [loading1, setLoading1] = useState(true)
    const [loading2, setLoading2] = useState(false)

    const [message, setMessage] = useState()

    const onChangeDenom = useCallback((_e, _i, value) => { setDenomination(value) }, [])
    const onChangePurpose = useCallback((_e, _i, value) => { setPurpose(value) }, [])
    const onAdd = useCallback(async () => {

        setMessage("")

        const response = await fetchApi(`auditory/${auditoryId}/denom-purpose`, {
            method: 'put',
            body: JSON.stringify({
                denomId: denomination,
                purposeId: purpose
            })
        }, true)

        const json = await response.json()

        if (!json.success) {
            setMessage(json.message)
        } else {
            updateBindings()
        }

    }, [auditoryId, denomination, purpose, updateBindings])

    const onRemoveBuilder = (bindingId) => async () => {

        await fetchApi(`auditory/denom-purpose/${bindingId}`, {
            method: 'delete'
        })

        updateBindings()
    }

    const updateBindings = useCallback(async () => {
        setLoading2(true)
        setBindings(await getRows(`${auditoryId}/denom-purpose`))
        setLoading2(false)
    }, [auditoryId])


    useEffect(() => {
        (async () => {

            setDenominations(await getRows('denomination'))
            setPurposes(await getRows('purpose'))

            setLoading1(false)

            updateBindings()
        })()
    }, [updateBindings])

    return (
        <div>
            {loading1 ?
                <Loading />
                :
                (<Fragment>
                    <p>Наименование:</p>
                    <SelectField autoWidth={true} fullWidth={true} onChange={onChangeDenom} value={denomination}>
                        <MenuItem value={undefined}/>
                        {denominations.map((item, i) => <MenuItem key={i} value={item.id} primaryText={item.name} />)}
                    </SelectField>

                    <p>Назначение:</p>
                    <SelectField autoWidth={true} fullWidth={true} required onChange={onChangePurpose} errorText={!purpose && "Необходимо выбрать назначение"} value={purpose}>{
                        purposes.map(({ id, name }, i) => <MenuItem key={i} value={id} primaryText={name} />)
                    }</SelectField>

                    <br /><br />
                    
                    <RaisedButton disabled={!purpose} buttonStyle={{ color: 'white' }} onClick={onAdd} primary>Добавить</RaisedButton>
                    {message && <span className={messageCss}>{message}</span>}
                </Fragment>)
            }

            {loading2 ?
                <Loading />
                :
                bindings.length > 0 &&
                (<Fragment>
                    <hr />
                    <p>Список привязок</p>
                    <Table selectable={false} style={{ width: "auto" }} bodyStyle={{ overflowX: "auto" }}>
                        <TableBody displayRowCheckbox={false}>
                            <TableRow>
                                <TableRowColumn><b>Наименование</b></TableRowColumn>
                                <TableRowColumn><b>Назначение</b></TableRowColumn>
                                <TableRowColumn></TableRowColumn>
                            </TableRow>
                            {bindings.map(({ id, denomName, purposeName }, i) => (
                                <TableRow key={i} >
                                    <TableRowColumn>{denomName}</TableRowColumn>
                                    <TableRowColumn>{purposeName}</TableRowColumn>
                                    <TableRowColumn>
                                        <FloatingActionButton style={{ marginLeft: '8px' }} title="Удалить привязку" mini={true} secondary={true} onClick={onRemoveBuilder(id)}>
                                            <ActionDelete />
                                        </FloatingActionButton>
                                    </TableRowColumn>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Fragment>
                )}
        </div>
    )
}