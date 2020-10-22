import React, { useState, useCallback, useEffect } from 'react'
import { FloatingActionButton, RaisedButton, TextField, MenuItem, SelectField } from 'material-ui'
import { css } from '@emotion/core'

import { fetchDevApi as fetchApi} from 'share/utils'

import {
    Table,
    TableBody,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table'


import ActionDelete from 'material-ui/svg-icons/action/delete';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import ActionDone from 'material-ui/svg-icons/action/done';
import ContentUndo from 'material-ui/svg-icons/content/undo';

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


export default function MatTechEquipment({ auditoryId, updateRef }) {

    const [softwareTypes, setSoftwareTypes] = useState([])
    const [softwareType, setSoftwareType] = useState()
    const [description, setDescription] = useState("")
    const [equipments, setEquipments] = useState([])

    const [editable, setEditable] = useState()

    const [loading1, setLoading1] = useState(true)
    const [loading2, setLoading2] = useState(false)

    const [message, setMessage] = useState()

    const onChangeSoftwareType = useCallback((e, i, value) => setSoftwareType(value), [])
    const onChangeDescription = useCallback((e, value) => setDescription(value), [])
    const onAdd = useCallback(async () => {

        setMessage("")

        const response = await fetchApi(`auditory/${auditoryId}/mat-tech-equipment`, {
            method: 'put',
            body: JSON.stringify({
                softwareType,
                description
            }, true)
        })

        const json = await response.json()

        if (!json.success) {
            setMessage(json.message)
        } else {
            updateEquipments()
        }
    }, [auditoryId, description, softwareType, updateEquipments])

    const onEditBuilder = (editableEq) => () => setEditable(editableEq)

    const onRemoveBuilder = (id) => async () => {

        await fetchApi(`auditory/mat-tech-equipment/${id}`, {
            method: 'delete'
        })

        updateEquipments()
    }


    const onEditDescription = (e, value) => setEditable({ ...editable, description: value })
    const onEditType = (e, i, value) => setEditable({ ...editable, softwareType: value })

    const onCancelEdit = () => setEditable(null)

    const onUpdateBuilder = (id) => async () => {

        await fetchApi(`auditory/${auditoryId}/mat-tech-equipment/${id}`, {
            method: 'post',
            body: JSON.stringify({
                description: editable.description,
                softwareType: editable.softwareType
            })
        }, true)

        setEditable(null)
        updateEquipments()
    }

    const updateEquipments = useCallback(async () => {
        setLoading2(true)
        setEquipments(await getRows(`${auditoryId}/mat-tech-equipment`))
        setLoading2(false)
    }, [auditoryId])

    useEffect(() => {

        updateRef.current = false;

        (async () => {

            setSoftwareTypes(await getRows('softwareType'))
            setLoading1(false)
            updateEquipments()

        })()

    }, [updateEquipments, updateRef])

    return (
        <>

            {loading1 ? <Loading />
                :
                (<>

                    <p>Тип:</p>
                    <SelectField autoWidth={true} fullWidth={true} required onChange={onChangeSoftwareType} errorText={!softwareType && "Необходимо выбрать тип оснащения"} value={softwareType}>
                        {softwareTypes.map(({ id, name }, i) => <MenuItem key={i} value={id} primaryText={name} />)}
                    </SelectField>

                    <p>Описание:</p>
                    <TextField value={description} fullWidth multiLine rows={4} onChange={onChangeDescription} required errorText={!description && "Необходимо ввести описание"} />

                    <br />

                    <RaisedButton disabled={!softwareType || !description} onClick={onAdd} buttonStyle={{ color: 'white' }} primary>Добавить</RaisedButton>
                    {message && <span className={messageCss}>{message}</span>}

                </>
                )
            }

            {
                loading2 ? <Loading /> : (
                    equipments.length > 0 && (
                        <>
                            <hr />
                            <Table selectable={false} style={{ width: "100%" }} bodyStyle={{ overflowX: "auto" }}>
                                <TableBody displayRowCheckbox={false}>
                                    <TableRow>
                                        <TableRowColumn>
                                            <b>Описание</b>
                                        </TableRowColumn>
                                        <TableRowColumn><b>Тип</b></TableRowColumn>
                                        <TableRowColumn></TableRowColumn>
                                    </TableRow>
                                    {equipments.map(({ id, description, softwareType, softwareTypeName }, i) => editable && editable.id === id ? (
                                        <TableRow key={i}>

                                            <TableRowColumn>
                                                <TextField style={{width: "100%"}} value={editable.description} errorText={!editable.description && "Необходимо ввести описание"} onChange={onEditDescription}/>
                                            </TableRowColumn>

                                            <TableRowColumn>
                                                <SelectField autoWidth={true} fullWidth={true} value={editable.softwareType} onChange={onEditType}>
                                                    {softwareTypes.map(({ id, name }, j) => <MenuItem key={j} value={id} primaryText={name} />)}
                                                </SelectField>
                                            </TableRowColumn>

                                            <TableRowColumn style={{ textAlign: "center" }}>
                                                <FloatingActionButton title="Отмена" mini={true} secondary={false} onClick={onCancelEdit}>
                                                    <ContentUndo />
                                                </FloatingActionButton>
                                                <FloatingActionButton title="Обновить" mini={true} secondary={true} onClick={onUpdateBuilder(id)}>
                                                    <ActionDone />
                                                </FloatingActionButton>
                                            </TableRowColumn>

                                        </TableRow>
                                    ) : (
                                            <TableRow key={i}>

                                                <TableRowColumn style={{whiteSpace: 'break-spaces', overflow: "visible"}}>
                                                    {description}
                                                </TableRowColumn>

                                                <TableRowColumn style={{whiteSpace: 'break-spaces', overflow: "visible"}}>{softwareTypeName}</TableRowColumn>

                                                <TableRowColumn style={{ textAlign: "center" }}>

                                                    <FloatingActionButton title="Редактировать" mini={true} secondary={false} onClick={onEditBuilder({ id, description, softwareType })}>
                                                        <EditorModeEdit />
                                                    </FloatingActionButton>
                                                    <FloatingActionButton title="Удалить" mini={true} secondary={true} onClick={onRemoveBuilder(id)}>
                                                        <ActionDelete />
                                                    </FloatingActionButton>
                                                </TableRowColumn>
                                            </TableRow>
                                        ))}
}
                                </TableBody>
                            </Table>
                        </>
                    )
                )
            }

        </>
    )
}