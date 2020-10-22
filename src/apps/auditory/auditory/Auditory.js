import React, {useEffect, useCallback, useState, memo } from 'react'
import { fetchDevApi as fetchApi} from 'share/utils'

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';

import ContentAdd from 'material-ui/svg-icons/content/add';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';

import UpdateAuditoryForm from './UpdateAuditoryForm'

import Loading from '../Loading'

import { debounce } from 'lodash'


export default memo(function Auditory({
    buildingList, softwareList, nameList, equipmentList,
    updateAuditoryList, auditoryList, auditoryTypeList
}) {
    
    const [addModeBuildingId, setAddModeBuildingId] = useState(buildingList.length > 0 ? buildingList[0].Id : null)
    const [buildingId, setBuildingId] = useState()
    const [typeIdFilter, setTypeIdFilter] = useState()
    const [nameFilter, setNameFilter] = useState()
    
    const [editModeData, setEditModeData] = useState()
    const [addMode, setAddMode] = useState(false)

    const [loadingAuditoryList, setLoadingAuditoryList] = useState(false)


    useEffect(() => {

        if (buildingList.length > 0)
            setAddModeBuildingId(buildingList[0].Id)
        

    }, [buildingList, auditoryTypeList])
    

    const handleChangeBuildingAddMode = useCallback((e, i, value) => {
        setAddModeBuildingId(value)
    }, [])

    const handleClickChooseBuilding = useCallback(async () => {
        setLoadingAuditoryList(true)
        setBuildingId(addModeBuildingId)
        await updateAuditoryList(addModeBuildingId, typeIdFilter)
        setLoadingAuditoryList(false)
    }, [addModeBuildingId, typeIdFilter, updateAuditoryList])

    const handleClickAddAuditory = useCallback(() => {
        setAddMode(true)
    }, [])

    const applyAudNameFilter = debounce((buildingId, typeId, name) => {
        setNameFilter(name)
        updateAuditoryList(buildingId, typeId, name)
    }, 1000)

    const handleAudNameFilter = useCallback((e) => {
        applyAudNameFilter(addModeBuildingId, typeIdFilter, e.target.value)
    }, [addModeBuildingId, typeIdFilter, applyAudNameFilter])

    const handleClickEditModeBuilder = (data) => {
        return () => setEditModeData({ ...data })
    }

    const handleRemoveBtnClickBuilder = (id) => {
        return async () => {

            if (!confirm('Вы уверены, что хотите удалить данные по выбранной аудитории?')) {
                return
            }

            try {                         

                await fetchApi("auditory/" + id, {
                    method: "delete",
                    throwError: true
                })

                await updateAuditoryList(addModeBuildingId, typeIdFilter)

            } catch (err) {
                let json = await err.json()
                alert(json.error || json.message)
            }
        }
    }

    const handleChangeTypeFilter = async (e) => {

        setTypeIdFilter(e.target.value)
        await updateAuditoryList(addModeBuildingId, e.target.value, nameFilter)

    }

    const onFinishUpdate = async () => {

        setLoadingAuditoryList(true)
        setEditModeData(null)
        setAddMode(false)
        await updateAuditoryList(buildingId, typeIdFilter, nameFilter)
        setLoadingAuditoryList(false)
    }

    const reset = useCallback(() => {
        if(addMode) setAddMode(false)
        if(editModeData) setEditModeData(false)
    }, [addMode, editModeData])

    if (addMode) return <UpdateAuditoryForm reset={reset} buildingId={buildingId} onFinish={onFinishUpdate} auditoryTypeList={auditoryTypeList} />

    if (editModeData) return <UpdateAuditoryForm reset={reset} nameList={nameList} equipmentList={equipmentList} softwareList={softwareList} buildingId={buildingId} onFinish={onFinishUpdate} auditoryTypeList={auditoryTypeList} auditory={editModeData} editMode />

    if (buildingList.length === 0) return <Loading />

    return (
        <div style={{ width: "90%", marginLeft: "5%" }}>

            <br />

            <p>Выберите корпус:</p>

            <SelectField style={{ fontSize: "13px" }} value={addModeBuildingId} onChange={handleChangeBuildingAddMode}>
                {buildingList.map((item) => {
                    return <MenuItem key={item.Id} value={item.Id} primaryText={item.Name} />
                })}
            </SelectField>

            <br />

            <RaisedButton label="Выбрать корпус" onClick={handleClickChooseBuilding} />

            {buildingId && <RaisedButton onClick={handleClickAddAuditory} labelPosition="after" icon={<ContentAdd />} style={{ marginLeft: "8px" }} label="Добавить аудиторию" />}

            <br /><br/>

            {
                !loadingAuditoryList ? (
                    buildingId && (
                        <Table selectable={false}>

                            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                                <TableRow>
                                    <TableHeaderColumn style={{whiteSpace: "break-spaces"}}>Номер (название): <input style={{width: "100px"}} placeholder="Фильтр" onChange={handleAudNameFilter} /></TableHeaderColumn>
                                    <TableHeaderColumn>
                                        <select style={{ width: "100%" }} onChange={handleChangeTypeFilter}>
                                            <option value="">Тип: Все</option>
                                            {auditoryTypeList.map((item) => {
                                                return <option key={item.Id} value={item.Id}>Тип: {item.Name}</option>
                                            })}
                                        </select>
                                    </TableHeaderColumn>
                                    <TableHeaderColumn>Мультимедийная</TableHeaderColumn>
                                    <TableHeaderColumn>Площадь (м<sup>2</sup>)</TableHeaderColumn>
                                    <TableHeaderColumn>Количество мест</TableHeaderColumn>
                                    <TableHeaderColumn style={{whiteSpace: "break-spaces"}}>Используется в ИС "Расписание"</TableHeaderColumn>
                                    <TableHeaderColumn></TableHeaderColumn>
                                </TableRow>
                            </TableHeader>

                            <TableBody displayRowCheckbox={false}>
                                {auditoryList && auditoryList.map((item) => {

                                    return (
                                        <TableRow key={item.Id}>
                                            <TableRowColumn style={{whiteSpace: "break-spaces"}}>{item.Name}</TableRowColumn>
                                            <TableRowColumn style={{whiteSpace: "break-spaces", overflow: "visible"}}>{item.TypeName}</TableRowColumn>
                                            <TableRowColumn>{item.Multimedia === 1 ? "Да" : "Нет"}</TableRowColumn>
                                            <TableRowColumn>{item.Area}</TableRowColumn>
                                            <TableRowColumn>{item.NumberOfSeats}</TableRowColumn>
                                            <TableRowColumn>{item.UsedInSchedule > 0 ? "Да" : "Нет"}</TableRowColumn>
                                            <TableRowColumn style={{ textAlign: "center" }}>

                                                <FloatingActionButton title="Редактировать аудиторию" mini={true} secondary={false} onClick={handleClickEditModeBuilder(item)}>
                                                    <EditorModeEdit />
                                                </FloatingActionButton>

                                                <FloatingActionButton style={{ marginLeft: '8px' }} title="Удалить аудиторию" mini={true} secondary={true} onClick={handleRemoveBtnClickBuilder(item.Id)}>
                                                    <ActionDelete />
                                                </FloatingActionButton>

                                            </TableRowColumn>
                                        </TableRow>
                                    )

                                })}
                            </TableBody>
                        </Table>
                    )
                ) : <Loading />
            }

        </div>
    )
})