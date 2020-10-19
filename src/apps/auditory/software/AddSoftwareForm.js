import React from 'react'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

import { css } from 'react-emotion'

import { DatePicker } from 'material-ui'
import { FileFileDownload } from 'material-ui/svg-icons'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import RaisedButton from 'material-ui/RaisedButton'

import { fetchDevApi as fetchApi } from 'public/utils/api'

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

    const [name, setName] = React.useState()
    const [description, setDescription] = React.useState()
    const [requisites, setRequisites] = React.useState()
    const [license, setLicense] = React.useState()
    const [purchaseDate, setPurchaseData] = React.useState(new Date())
    const [validity, setValidity] = React.useState(new Date())
    const [licenseCount, setLicenseCount] = React.useState()
    const [files, setFiles] = React.useState()

    const [saving, setSaving] = React.useState(false)

    const onChangeName = React.useCallback((e) => setName(e.target.value), [setName])
    const onChangeDescription = React.useCallback((e) => setDescription(e.target.value), [setDescription])
    const onChangeRequisites = React.useCallback((e) => setRequisites(e.target.value), [setRequisites])
    const onChangeLicense = React.useCallback((e, i, value) => setLicense(value), [setLicense])
    const onChangePurchaseDate = React.useCallback((e, value) => setPurchaseData(value), [setPurchaseData])
    const onChangeValidity = React.useCallback((e, value) => setValidity(value), [setValidity])
    const onChangeLicenseCount = React.useCallback((e) => setLicenseCount(e.target.value), [setLicenseCount])

    const onChangeFile = React.useCallback((e) => {
        setFiles(e.target.files)
    })

    const onSubmit = React.useCallback(async () => {

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

            setSaving(true)

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
                    validity: validity.toString(), licenseCount, documentFileName
                })
            }, true, true)

            onFinish(true)

            setSaving(false)

        } catch (err) {
            setError(err)
        }

    }, [name, description, requisites, license, purchaseDate, validity, licenseCount, files])    

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
            <div style={{ marginBottom: '32px' }}>
                <RaisedButton buttonStyle={{color: 'white'}} primary onClick={onFinish}>Отмена</RaisedButton>
                <RaisedButton buttonStyle={{color: 'white'}} primary onClick={onSubmit} style={{ marginLeft: '8px' }}>Добавить</RaisedButton>
            </div>
        </div>
    )
}