import React, { useState, useCallback } from 'react'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

import { css } from '@emotion/core'

import { DatePicker, Checkbox } from 'material-ui'
import RaisedButton from 'material-ui/RaisedButton'

import { fetchDevApi as fetchApi} from 'share/utils'

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

export default function EditSoftwareForm({ onFinish, softwareLicenseList, setError }) {

    const [name, setName] = useState()
    const [description, setDescription] = useState()
    const [requisites, setRequisites] = useState()
    const [license, setLicense] = useState()
    const [purchaseDate, setPurchaseData] = useState(new Date())
    const [validity, setValidity] = useState(new Date())
    const [licenseCount, setLicenseCount] = useState()
    const [files, setFiles] = useState()
    const [noScan, setNoScan] = useState(false)    

    const onChangeName = useCallback((e) => setName(e.target.value), [setName])
    const onChangeDescription = useCallback((e) => setDescription(e.target.value), [setDescription])
    const onChangeRequisites = useCallback((e) => setRequisites(e.target.value), [setRequisites])
    const onChangeLicense = useCallback((e, i, value) => setLicense(value), [setLicense])
    const onChangePurchaseDate = useCallback((e, value) => setPurchaseData(value), [setPurchaseData])
    const onChangeValidity = useCallback((e, value) => setValidity(value), [setValidity])
    const onChangeLicenseCount = useCallback((e) => setLicenseCount(e.target.value), [setLicenseCount])
    const onChangeNoScan = useCallback(() => setNoScan(!noScan), [noScan])

    const onChangeFile = useCallback((e) => {
        setFiles(e.target.files)
    }, [])

    const onSubmit = useCallback(async () => {

        try {

            let documentFileName = ''

            if (files && files.length > 1) {
                alert("Прикрепить можно только один файл документа!")
                return
            }

            if(!name) {
                alert("Необходимо указать наименование ПО!")
                return
            }            

            if (files && files.length === 1) {

                const fd = new FormData

                for (let file of files) {
                    fd.append(file.name, file);
                }

                fd.append('uniqueNames', true);
                //fd.append('overwrite', true);

                let result = await fetchApi("storage/auditory", {
                    body: fd,
                    method: 'PUT',
                    toJSON: true
                }, false, true)                

                documentFileName = result.fileNames[0]
            }

            await fetchApi('auditory/software', {
                method: 'put',
                body: JSON.stringify({                    
                    name, description, requisites, license, purchaseDate: purchaseDate.toString(),
                    validity: validity.toString(), licenseCount, documentFileName, noScan
                })
            }, true, true)

            onFinish(true)
            

        } catch (err) {
            setError(err)
        }

    }, [files, name, description, requisites, license, purchaseDate, validity, licenseCount, noScan, onFinish, setError])    

    return (
        <div style={{ marginLeft: '15%' }} className={rootCss}>
            <br />
            <div>
                <p>Наименование:</p>
                <TextField onChange={onChangeName} value={name}  {...textFieldProps} />
            </div>
            <div>
                <p>Описание:</p>
                <TextField {...textareaProps} onChange={onChangeDescription} value={description} />
            </div>
            <div>
                <p>Реквизиты документа (договора):</p>
                <TextField underlineStyle={{ bottom: '0px' }} inputStyle={{ border: '1px solid rgba(1,1,1,0.2)', borderBottom: 'none' }} rows={6} onChange={onChangeRequisites} multiLine style={{ fontSize: "13px" }} value={requisites} />
            </div>
            <div>
                <p>Лицензия:</p>
                <SelectField value={license} style={{ fontSize: "13px" }} onChange={onChangeLicense}>
                    {softwareLicenseList.map(softwareLicense => {
                        return <MenuItem value={softwareLicense.Id} primaryText={softwareLicense.Name} />
                    })}
                </SelectField>
            </div>
            <div>
                <p>Дата приобретения:</p>
                <DatePicker onChange={onChangePurchaseDate} okLabel='Ок' cancelLabel='Отмена' value={new Date(purchaseDate)} locale='ru-RU' DateTimeFormat={Intl.DateTimeFormat} />
            </div>
            <div>
                <p>Дата завершения лицензии:</p>
                <DatePicker onChange={onChangeValidity} okLabel='Ок' cancelLabel='Отмена' value={new Date(validity)} locale='ru-RU' DateTimeFormat={Intl.DateTimeFormat} />
            </div>
            <div>
                <p>Количество лицензий:</p>
                <TextField value={licenseCount} onChange={onChangeLicenseCount} style={{ fontSize: "13px" }} type="number" min={0} />
            </div>            
            <div>
                <p>Файл документа:</p>
                <input onChange={onChangeFile} type="file" />
            </div>
            <br />
            <div>
                <Checkbox onClick={onChangeNoScan} label="Скан документов не требуется" />
            </div>
            <br/>
            <div style={{ marginBottom: '32px' }}>
                <RaisedButton buttonStyle={{color: 'white'}} primary onClick={onFinish}>Отмена</RaisedButton>
                <RaisedButton buttonStyle={{color: 'white'}} primary onClick={onSubmit} style={{ marginLeft: '8px' }}>Добавить</RaisedButton>
            </div>
        </div>
    )
}