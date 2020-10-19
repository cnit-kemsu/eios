import React from 'react'
import { fetchApi } from 'public/utils/api'

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';

import ContentAdd from 'material-ui/svg-icons/content/add';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import ActionDone from 'material-ui/svg-icons/action/done';
import ContentUndo from 'material-ui/svg-icons/content/undo';

import UpdateAuditoryForm from './UpdateAuditoryForm'

import Loading from '../Loading'

import _ from 'lodash'


export default React.memo(function Auditory({
    setError, buildingList, loading, softwareList, nameList, equipmentList,
    updateAuditoryList, auditoryList, auditoryTypeList
}) {

    const [showEditForm, setShowEditForm] = React.useState(false)
    const [addModeBuildingId, setAddModeBuildingId] = React.useState(buildingList.length > 0 ? buildingList[0].Id : null)
    const [buildingId, setBuildingId] = React.useState()
    const [typeIdFilter, setTypeIdFilter] = React.useState()
    const [nameFilter, setNameFilter] = React.useState()
    const [addModeAudArea, setAddModeAudArea] = React.useState()
    const [addModeCountOfSeats, setAddModeCountOfSeats] = React.useState()
    const [addModeAuditoryTypeId, setAddModeAuditoryTypeId] = React.useState(auditoryTypeList.length > 0 ? auditoryTypeList[0].Id : null)
    const [editModeData, setEditModeData] = React.useState()
    const [addMode, setAddMode] = React.useState(false)

    const [loadingAuditoryList, setLoadingAuditoryList] = React.useState(false)



    React.useEffect(() => {

        if (buildingList.length > 0)
            setAddModeBuildingId(buildingList[0].Id)

        if (auditoryTypeList.length > 0)
            setAddModeAuditoryTypeId(auditoryTypeList[0].Id)

    }, [buildingList, auditoryTypeList])

    const handleChangeBuildingAddMode = React.useCallback((e, i, value) => {
        setAddModeBuildingId(value)
    }, [])

    const handleClickChooseBuilding = React.useCallback(async () => {
        setLoadingAuditoryList(true)
        setBuildingId(addModeBuildingId)
        await updateAuditoryList(addModeBuildingId, typeIdFilter)
        setLoadingAuditoryList(false)
    }, [addModeBuildingId, typeIdFilter])

    const handleClickAddAuditory = React.useCallback(() => {
        setAddMode(true)
    }, [])

    const applyAudNameFilter = _.debounce((buildingId, typeId, name) => {
        setNameFilter(name)
        updateAuditoryList(buildingId, typeId, name)
    }, 1000)

    const handleAudNameFilter = React.useCallback((e) => {
        applyAudNameFilter(addModeBuildingId, typeIdFilter, e.target.value)
    }, [addModeBuildingId, typeIdFilter])

    const handleClickEditModeBuilder = (data) => {
        return () => setEditModeData({ ...data })
    }

    const handleRemoveBtnClickBuilder = (id) => {
        return async () => {

            if (!confirm('Вы уверены, что хотите удалить данные по выбранной аудитории?')) {
                return
            }

            try {

                let response = await fetchApi(`auditory/${id}/schedule-links`, {
                    method: 'get',
                    throwError: true
                })              

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

    if (addMode) return <UpdateAuditoryForm buildingId={buildingId} onFinish={onFinishUpdate} auditoryTypeList={auditoryTypeList} />

    if (editModeData) return <UpdateAuditoryForm nameList={nameList} equipmentList={equipmentList} softwareList={softwareList} buildingId={buildingId} onFinish={onFinishUpdate} auditoryTypeList={auditoryTypeList} auditory={editModeData} editMode />

    if (buildingList.length === 0) return <Loading />

    return (
        <div style={{ width: "70%", marginLeft: "15%" }}>

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

            <br />

            {
                !loadingAuditoryList ? (
                    buildingId && (
                        <Table selectable={false}>

                            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                                <TableRow>
                                    <TableHeaderColumn>Номер (название): <input placeholder="Фильтр" onChange={handleAudNameFilter} /></TableHeaderColumn>
                                    <TableHeaderColumn>
                                        <select style={{ width: "100%" }} onChange={handleChangeTypeFilter}>
                                            <option value="">Тип: Все</option>
                                            {auditoryTypeList.map((item) => {
                                                return <option key={item.Id} value={item.Id}>Тип: {item.Name}</option>
                                            })}
                                        </select>
                                    </TableHeaderColumn>
                                    <TableHeaderColumn>Площадь (м<sup>2</sup>)</TableHeaderColumn>
                                    <TableHeaderColumn>Количество мест</TableHeaderColumn>
                                    <TableHeaderColumn></TableHeaderColumn>
                                </TableRow>
                            </TableHeader>

                            <TableBody displayRowCheckbox={false}>
                                {auditoryList && auditoryList.map((item) => {

                                    return (
                                        <TableRow key={item.Id}>
                                            <TableRowColumn>{item.Name}</TableRowColumn>
                                            <TableRowColumn>{item.TypeName}</TableRowColumn>
                                            <TableRowColumn>{item.Area}</TableRowColumn>
                                            <TableRowColumn>{item.NumberOfSeats}</TableRowColumn>
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