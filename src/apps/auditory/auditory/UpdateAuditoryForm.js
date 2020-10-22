import React, { useEffect, useState, useCallback, useRef } from 'react'
import { RaisedButton, TextField, SelectField, MenuItem, Tab, Tabs, Checkbox } from 'material-ui'
import { css } from '@emotion/core'


import { fetchDevApi as fetchApi} from 'share/utils'

import NameBindingForm  from './NameBindingForm2'
import BindingForm from './BindingForm'
import MatTechEquipment from './MatTechEquipment'


const rootCss = css`
    p {
        font-weight: bold;
    }
`


export default function UpdateAuditoryForm({ reset, buildingId, softwareList, auditory, onFinish, editMode, auditoryTypeList }) {    

    const [name, setName] = useState(editMode ? auditory.Name : "")
    const [typeId, setTypeId] = useState(editMode ? auditory.Type : "")
    const [area, setArea] = useState(editMode ? auditory.Area : "")
    const [numberOfSeats, setNumberOfSeats] = useState(editMode ? auditory.NumberOfSeats : "")
    const [multimedia, setMultimedia] = useState(editMode ? (auditory.Multimedia === 1 ? true : false) : "")    

    const [softwares, setSoftwares] = useState([])
    const [loadingSoftwares, setLoadingSoftwares] = useState(true)
    const [bindingSoftware, setBindingSoftware] = useState()        

    const updateMatTechEquipment = useRef(false)


    const handleChangeAudType = useCallback((e, i, value) => {
        setTypeId(value)
    }, [])

    const handleChangeName = useCallback((e, value) => {
        setName(value)
    }, [])

    const handleChangeArea = useCallback((e, v) => {
        setArea(v)
    }, [])

    const handleChangeCountOfSeats = useCallback((e, v) => {
        setNumberOfSeats(v)
    }, [])    

    const handleChangeMultimedia = useCallback(() => setMultimedia(!multimedia), [multimedia])

    const onEdit = useCallback(async () => {

        if (!name || !typeId) return

        try {

            await fetchApi("auditory/" + auditory.Id, {
                method: "post",
                body: JSON.stringify({
                    name,
                    typeId,
                    buildingId,
                    area,
                    numberOfSeats,
                    multimedia
                }),
                throwError: true
            })

            onFinish()

        } catch (err) {
            let json = await err.json()
            alert(json.error || json.message)
        }
    }, [name, typeId, auditory.Id, buildingId, area, numberOfSeats, multimedia, onFinish])

    const onAdd = useCallback(async () => {

        if (!name || !typeId) return

        try {

            await fetchApi("auditory", {
                method: "post",
                body: JSON.stringify({
                    name,
                    typeId,
                    buildingId,
                    area,
                    numberOfSeats,
                    multimedia
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
    }, [name, typeId, buildingId, area, numberOfSeats, multimedia, onFinish])

    const updateAudSoftwares = useCallback(async () => {
        setLoadingSoftwares(true)
        setSoftwares(await fetchApi(`auditory/${auditory.Id}/software`, { toJSON: true }))
        setLoadingSoftwares(false)
    }, [auditory.Id])  

    const bindSoftware = (softwareId) => async () => {

        try {

            setBindingSoftware(true)
            await fetchApi(`auditory/${auditory.Id}/software/${softwareId}`, { method: 'post' }, true, true)
            updateMatTechEquipment.current = true
            updateAudSoftwares()

        } catch (err) {
            let result = await err.json()
            alert(result.error || result.message)
        } finally {
            setBindingSoftware(false)
        }
    }  

    
    const unbindSoftware = (softwareId) => async () => {
        try {
            setBindingSoftware(true)
            await fetchApi(`auditory/${auditory.Id}/software/${softwareId}`, { method: "delete" }, true, true)
            updateMatTechEquipment.current = true
            updateAudSoftwares()

        } catch (err) {
            let result = await err.json()
            alert(result.error || result.message)
        } finally {
            setBindingSoftware(false)
        }
    }

    useEffect(() => {
        updateAudSoftwares()
    }, [updateAudSoftwares])

    const baseForm = (

        <>
            <br />

            <div >
                <p>Номер (название):</p>
                <TextField required value={name} onChange={handleChangeName} errorText={!name && "Необходимо указать номер (название) аудитории"} />
            </div>

            <div >
                <p>Тип:</p>
                <SelectField autoWidth={true} fullWidth={true} errorText={!typeId && "Необходимо выбрать тип аудитории"} required value={typeId} onChange={handleChangeAudType}>
                    {auditoryTypeList.map(item => <MenuItem key={item.Id} value={item.Id} primaryText={item.Name} />)}
                </SelectField>
            </div>

            <div>
                <p>Мультимедийная аудитория:</p>
                <Checkbox onClick={handleChangeMultimedia} checked={multimedia} />
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

        </>
    )

    let content

    if (editMode) {
        content = (
            <>
                <br />
                <RaisedButton onClick={reset} primary buttonStyle={{ color: 'white'}} style={{margin: '1em 0px'}}>Назад</RaisedButton>
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
                        <MatTechEquipment updateRef={updateMatTechEquipment} auditoryId={auditory.Id} />
                    </Tab>
                </Tabs>
            </>
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