import React from 'react'
import { RaisedButton, TextField, SelectField, MenuItem, Tab, Tabs, FloatingActionButton } from 'material-ui'
import { css } from 'react-emotion'
import ContentAdd from 'material-ui/svg-icons/content/add';
import ActionDelete from 'material-ui/svg-icons/action/delete';

import { fetchDevApi as fetchApi } from 'public/utils/api'

import NameBindingForm from './NameBindingForm'
import BindingForm from './BindingForm'

import Loading from '../Loading'

const textFieldProps = {
    inputStyle: { height: "auto", fontSize: "13px" },
    style: { height: "36px" }
}

const textareaProps = {
    underlineStyle: { bottom: '0px' },
    inputStyle: { border: '1px solid rgba(1,1,1,0.2)', borderBottom: 'none' },
    rows: 6,
    multiLine: true,
    style: { fontSize: "13px" }
}

const rootCss = css`
    p {
        font-weight: bold;
    }
`



function convertSoftwares(softwares, audSoftwares, filterStr) {

    softwares = softwares.map(software => {

        software.bindToAud = audSoftwares.some(({ Id }) => software.Id === Id)

        return software
    })

    softwares.sort((a, b) => {
        if (!a.bindToAud && b.bindToAud) return 1
        if (a.bindToAud && !b.bindToAud) return -1
        return 0
    })

    if (filterStr) softwares = softwares.filter(({ Name }) => Name.toLowerCase().includes(filterStr.toLowerCase()))

    return softwares
}


export default function UpdateAuditoryForm({ buildingId, softwareList, nameList, equipmentList, auditory, setError, onFinish, editMode, auditoryTypeList }) {

    const [name, setName] = React.useState(editMode ? auditory.Name : null)
    const [typeId, setTypeId] = React.useState(editMode ? auditory.Type : null)
    const [area, setArea] = React.useState(editMode ? auditory.Area : null)
    const [numberOfSeats, setNumberOfSeats] = React.useState(editMode ? auditory.NumberOfSeats : null)

    const [softwares, setSoftwares] = React.useState([])
    const [loadingSoftwares, setLoadingSoftwares] = React.useState(true)
    const [bindingSoftware, setBindingSoftware] = React.useState()    

    const [equipments, setEquipments] = React.useState([])
    const [loadingEquipments, setLoadingEquipments] = React.useState(true)
    const [bindingEquipment, setBindingEquipment] = React.useState()


    const handleChangeAudType = React.useCallback((e, i, value) => {
        setTypeId(value)
    }, [])

    const handleChangeName = React.useCallback((e, value) => {
        setName(value)
    }, [])

    const handleChangeArea = React.useCallback((e, v) => {
        setArea(v)
    }, [])

    const handleChangeCountOfSeats = React.useCallback((e, v) => {
        setNumberOfSeats(v)
    }, [])

    const onEdit = React.useCallback(async (e) => {

        if (!name || !typeId) return

        try {

            await fetchApi("auditory/" + auditory.Id, {
                method: "post",
                body: JSON.stringify({
                    name,
                    typeId,
                    buildingId,
                    area,
                    numberOfSeats
                }),
                throwError: true
            })

            onFinish()

        } catch (err) {
            let json = await err.json()
            alert(json.error || json.message)
        }
    }, [name, typeId, buildingId, area, numberOfSeats])

    const onAdd = React.useCallback(async (e) => {

        if (!name || !typeId) return

        try {

            await fetchApi("auditory", {
                method: "post",
                body: JSON.stringify({
                    name,
                    typeId,
                    buildingId,
                    area,
                    numberOfSeats
                })
            }, true, true);

            onFinish()

        } catch (err) {

            let result = await err.json()

            if (!result.success && result.error === "Auditory already exists.") {
                alert("Аудитория с таким номером (названием) уже существует.");
            } else {
                alert(result.error || result.message)
            }
        }
    }, [name, typeId, buildingId, area, numberOfSeats])

    async function updateAudSoftwares() {
        setLoadingSoftwares(true)
        setSoftwares(await fetchApi(`auditory/${auditory.Id}/software`, { toJSON: true }))
        setLoadingSoftwares(false)
    }   

    async function updateAudEquipments() {
        setLoadingEquipments(true)
        setEquipments(await fetchApi(`auditory/${auditory.Id}/equipment`, { toJSON: true }))
        setLoadingEquipments(false)
    }

    const bindSoftware = (softwareId) => async () => {

        try {

            setBindingSoftware(true)
            await fetchApi(`auditory/${auditory.Id}/software/${softwareId}`, { method: 'post' }, true, true)
            updateAudSoftwares()

        } catch (err) {
            let result = await err.json()
            alert(result.error || result.message)
        } finally {
            setBindingSoftware(false)
        }
    }

    const bindName = (nameId) => async () => {

        try {

            setBindingName(true)
            await fetchApi(`auditory/${auditory.Id}/name/${nameId}`, { method: 'post' }, true, true)
            updateAudNames()

        } catch (err) {
            let result = await err.json()
            alert(result.error || result.message)
        } finally {
            setBindingName(false)
        }
    }

    const bindEquipment = (eqId) => async () => {

        try {

            setBindingEquipment(true)
            await fetchApi(`auditory/${auditory.Id}/equipment/${eqId}`, { method: 'post' }, true, true)
            updateAudEquipments()

        } catch (err) {
            let result = await err.json()
            alert(result.error || result.message)
        } finally {
            setBindingEquipment(false)
        }
    }

    const unbindSoftware = (softwareId) => async () => {
        try {
            setBindingSoftware(true)
            await fetchApi(`auditory/${auditory.Id}/software/${softwareId}`, { method: "delete" }, true, true)
            updateAudSoftwares()

        } catch (err) {
            let result = await err.json()
            alert(result.error || result.message)
        } finally {
            setBindingSoftware(false)
        }
    }

    const unbindName = (nameId) => async () => {

        try {

            setBindingName(true)
            await fetchApi(`auditory/${auditory.Id}/name/${nameId}`, { method: 'delete' }, true, true)
            updateAudNames()

        } catch (err) {
            let result = await err.json()
            alert(result.error || result.message)
        } finally {
            setBindingName(false)
        }
    }

    const unbindEquipment = (eqId) => async () => {

        try {

            setBindingEquipment(true)
            await fetchApi(`auditory/${auditory.Id}/equipment/${eqId}`, { method: 'delete' }, true, true)
            updateAudEquipments()

        } catch (err) {
            let result = await err.json()
            alert(result.error || result.message)
        } finally {
            setBindingEquipment(false)
        }
    }

    React.useEffect(() => {

        (async () => {
            await updateAudSoftwares()            
            await updateAudEquipments()
        })()


    }, [editMode && auditory.Id])

    const baseForm = (

        <React.Fragment>
            <br />

            <div >
                <p>Номер (название):</p>
                <TextField required value={name} onChange={handleChangeName} errorText={!name && "Необходимо указать номер (название) аудитории"} />
            </div>

            <div >
                <p>Тип:</p>
                <SelectField errorText={!typeId && "Необходимо выбрать тип аудитории"} required value={typeId} onChange={handleChangeAudType}>
                    {auditoryTypeList.map(item => <MenuItem key={item.Id} value={item.Id} primaryText={item.Name} />)}
                </SelectField>
            </div>

            <div>
                <p>Площадь (м2):</p>
                <TextField onChange={handleChangeArea} value={area} type="number" min={0} />
            </div>

            <div>
                <p>Количество мест:</p>
                <TextField onChange={handleChangeCountOfSeats} value={numberOfSeats} type="number" min={0} />
            </div>

            <br />

            <div style={{ marginBottom: '32px' }}>
                <RaisedButton buttonStyle={{ color: 'white' }} primary onClick={onFinish}>Отмена</RaisedButton>
                <RaisedButton disabled={!name || !typeId} onClick={editMode ? onEdit : onAdd} type="submit" buttonStyle={{ color: 'white' }} primary style={{ marginLeft: '8px' }}>{editMode ? 'Сохранить' : 'Добавить'}</RaisedButton>
            </div>

        </React.Fragment>
    )

    let content

    if (editMode) {
        content = (
            <React.Fragment>
                <br />
                <Tabs>
                    <Tab label="Основная информация" value="base">
                        {baseForm}
                    </Tab>
                    <Tab label="ПО" value="software">
                        <BindingForm bindingProcess={bindingSoftware} loading={loadingSoftwares} items={softwareList} bindTooltip="Привязать к аудитории"
                            unbindTooltip="Удалить связь с аудиторией" bindings={softwares} bind={bindSoftware} unbind={unbindSoftware} />
                    </Tab>
                    <Tab label="Наименования" value="names">
                        <NameBindingForm auditoryId={auditory.Id}/>
                    </Tab>
                    <Tab label="Оснащенность" value="equipment ">
                        <BindingForm bindingProcess={bindingEquipment} loading={loadingEquipments} items={equipmentList} bindTooltip="Привязать к аудитории"
                            unbindTooltip="Удалить связь с аудиторией" bindings={equipments} bind={bindEquipment} unbind={unbindEquipment} />
                    </Tab>
                </Tabs>
            </React.Fragment>
        )
    } else {
        content = baseForm
    }

    return (
        <div style={{ marginLeft: '15%', marginRight: "15%" }} className={rootCss} >
            {content}
        </div>

    )
}