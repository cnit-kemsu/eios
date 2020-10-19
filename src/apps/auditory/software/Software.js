import React from 'react'
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from 'material-ui/Table'

import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import RaisedButton from 'material-ui/RaisedButton'

import ContentAdd from 'material-ui/svg-icons/content/add'
import ActionDelete from 'material-ui/svg-icons/action/delete'
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit'
import ActionDone from 'material-ui/svg-icons/action/done'
import ContentUndo from 'material-ui/svg-icons/content/undo'

import SoftwareList from './SoftwareList'
import Loading from '../Loading'
import EditSoftwareForm from './EditSoftwareForm'

import { fetchDevApi as fetchApi } from 'public/utils/api'

export default function Software({ softwareList, loading, softwareLicenseList, setError, updateSoftwareList }) {

    const [editableSoftware, setEditableSoftware] = React.useState(null)
    
    const onEditButtonClick = React.useCallback(software => {
        setEditableSoftware(software)
    }, [setEditableSoftware])
    const onFinishEdit = React.useCallback(async (needUpdate) => {

        if (needUpdate) await updateSoftwareList()
        setEditableSoftware(null)

    }, [setEditableSoftware, updateSoftwareList])

    if (loading === 0) return <Loading />

    if (editableSoftware) return <EditSoftwareForm updateSoftwareList={updateSoftwareList} setError={setError} software={editableSoftware} softwareLicenseList={softwareLicenseList} onFinish={onFinishEdit} />    

    return <SoftwareList loading={loading} setError={setError} softwareList={softwareList} onEditButtonClick={onEditButtonClick} softwareLicenseList={softwareLicenseList} updateSoftwareList={updateSoftwareList} />
}