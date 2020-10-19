import React from 'react'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

import { css } from 'react-emotion'

import { DatePicker } from 'material-ui'
import { FileFileDownload, ActionDelete } from 'material-ui/svg-icons'

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

export default function EditSoftwareForm({ software: softwareProp, updateSoftwareList, onFinish, softwareLicenseList, setError }) {


    const [software, setSoftware] = React.useState(softwareProp)
    const [name, setName] = React.useState(software.Name)
    const [description, setDescription] = React.useState(software.Description)
    const [requisites, setRequisites] = React.useState(software.Requisites)
    const [license, setLicense] = React.useState(software.SoftwareLicenseId)
    const [purchaseDate, setPurchaseData] = React.useState(new Date(software.PurchaseDate))
    const [validity, setValidity] = React.useState(new Date(software.Validity))
    const [licenseCount, setLicenseCount] = React.useState(software.LicenseCount)
    const [files, setFiles] = React.useState()
    const [deletingFile, setDeletingFile] = React.useState(false)


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

            let documentFileName = software.DocumentFileName

            if (files && files.length > 1) {
                alert("Прикрепить можно только один файл документа!")
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

                console.log(result)

                documentFileName = result.fileNames[0]
            }

            await fetchApi('auditory/software/' + software.Id, {
                method: 'post',
                body: JSON.stringify({
                    forceUpdate: true,
                    name, description, requisites, license, purchaseDate: purchaseDate.toString(),
                    validity: validity.toString(), licenseCount, documentFileName
                })
            }, true, true)

            onFinish(true)

        } catch (err) {
            setError(err)
        }

    }, [name, description, requisites, license, purchaseDate, validity, licenseCount, files])

    const deleteFile = React.useCallback(async () => {

        if(!confirm("Вы уверены, что хотите удалить прикрепленный файл?")) return

        setDeletingFile(true)
        await fetchApi('auditory/software/' + software.Id, {
            method: 'post',
            body: JSON.stringify({ documentFileName: "" })
        }, true, true)
        await fetchApi(`/storage/auditory/${software.DocumentFileName}`, { method: 'delete' })        
        await updateSoftwareList()
        setSoftware({ ...software, DocumentFileName: null })
        setDeletingFile(false)
    }, [])

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
                <DatePicker onChange={onChangePurchaseDate} okLabel='Ок' cancelLabel='Отмена' value={purchaseDate} locale='ru-RU' DateTimeFormat={Intl.DateTimeFormat} />
            </div>
            <div>
                <p>Дата завершения лицензии:</p>
                <DatePicker onChange={onChangeValidity} okLabel='Ок' cancelLabel='Отмена' value={validity} locale='ru-RU' DateTimeFormat={Intl.DateTimeFormat} />
            </div>
            <div>
                <p>Количество лицензий:</p>
                <TextField value={licenseCount} onChange={onChangeLicenseCount} style={{ fontSize: "13px" }} type="number" min={0} />
            </div>
            {software.DocumentFileName && (
                <div>
                    <p>Файл документа:</p>
                    <RaisedButton target="_blank" href={`https://api-next.kemsu.ru/api/storage/auditory/${software.DocumentFileName}`} icon={<FileFileDownload />} label="Скачать" labelPosition="after" />
                    <RaisedButton secondary onClick={deleteFile} disabled={deletingFile} style={{ marginLeft: "8px" }} icon={<ActionDelete />} label="Удалить" labelPosition="after" />
                </div>)
            }
            <div>
                <p>Прикрепить новый файл документа:</p>
                <input onChange={onChangeFile} type="file" />
            </div>
            <br />
            <div style={{ marginBottom: '32px' }}>
                <RaisedButton buttonStyle={{ color: 'white' }} primary onClick={onFinish}>Отмена</RaisedButton>
                <RaisedButton buttonStyle={{ color: 'white' }} primary onClick={onSubmit} style={{ marginLeft: '8px' }}>Сохранить</RaisedButton>
            </div>
        </div>
    )
}