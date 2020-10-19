import React from 'react'
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table'


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
import { FileFileDownload } from 'material-ui/svg-icons'

import { fetchDevApi as fetchApi } from 'public/utils/api'

import AddSoftwareForm from './AddSoftwareForm'

import Loading from '../Loading'

export default function SoftwareList({ loading, softwareLicenseList, softwareList, onEditButtonClick, setError, updateSoftwareList }) {

    const [showAddForm, setShowAddForm] = React.useState(false)

    const onFinishAdd = React.useCallback(async (needUpdate) => {

        if (needUpdate) await updateSoftwareList()
        setShowAddForm(false)

    }, [setShowAddForm, updateSoftwareList])

    const handleAddSoftwareButton = React.useCallback(() => {
        setShowAddForm(true)
    }, [setShowAddForm])

    if (showAddForm) return <AddSoftwareForm setError={setError} softwareLicenseList={softwareLicenseList} onFinish={onFinishAdd} />

    if (loading) return <Loading />

    return (
        <div style={{ width: '70%', marginLeft: '15%' }}>
            <br />
            <RaisedButton onClick={handleAddSoftwareButton} icon={<ContentAdd />} label="Добавить ПО" labelPosition="after" />
            <br />
            <Table selectable={false}>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn style={{ textAlign: "center" }}>Наименование</TableHeaderColumn>
                        <TableHeaderColumn style={{ textAlign: "center" }}>Лицензия</TableHeaderColumn>
                        <TableHeaderColumn style={{ textAlign: "center" }}>Дата приобритения</TableHeaderColumn>
                        <TableHeaderColumn style={{ textAlign: "center" }}>Дата завершения лицензии</TableHeaderColumn>
                        <TableHeaderColumn style={{ textAlign: "center" }}>Кол-во лицензий</TableHeaderColumn>
                        <TableHeaderColumn></TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {softwareList.map((sofware, i) => {

                        const { Id, Name, LicenseName, PurchaseDate, Validity, LicenseCount, DocumentFileName } = sofware

                        return (
                            <TableRow key={i}>
                                <TableRowColumn style={{ textAlign: "center" }}>{Name}</TableRowColumn>
                                <TableRowColumn style={{ textAlign: "center" }}>{LicenseName}</TableRowColumn>
                                <TableRowColumn style={{ textAlign: "center" }}>{(new Date(PurchaseDate)).toLocaleDateString()}</TableRowColumn>
                                <TableRowColumn style={{ textAlign: "center" }}>{(new Date(Validity)).toLocaleDateString()}</TableRowColumn>
                                <TableRowColumn style={{ textAlign: "center" }}>{LicenseCount}</TableRowColumn>
                                <TableRowColumn style={{ textAlign: "center" }}>

                                    {DocumentFileName && <FloatingActionButton mini={true} title="Скачать прикрепленный файл" target="_blank" href={`https://api-next.kemsu.ru/api/storage/auditory/${DocumentFileName}`}>
                                        <FileFileDownload />
                                    </FloatingActionButton>}
                                    <FloatingActionButton style={{ marginLeft: '8px' }} title="Редактировать ПО" mini={true} secondary={false} onClick={() => onEditButtonClick(sofware)}>
                                        <EditorModeEdit />
                                    </FloatingActionButton>
                                    <FloatingActionButton style={{ marginLeft: '8px' }} title="Удалить ПО" mini={true} secondary={true} onClick={async () => {

                                        if (!confirm(`Вы уверены, что хотите удалить ПО "${Name}"${DocumentFileName ? ' вместе с прикрепленным файлом?' : '?'}`)) {
                                            return
                                        }

                                        try {
                                            await fetchApi('/auditory/software/' + Id, { method: 'delete' }, true, true)

                                            if (DocumentFileName) {
                                                await fetchApi(`/storage/auditory/${DocumentFileName}`, { method: 'delete' })
                                            }

                                            await updateSoftwareList()
                                        } catch (err) {
                                            setError(err)
                                        }

                                    }}>
                                        <ActionDelete />
                                    </FloatingActionButton>
                                </TableRowColumn>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}