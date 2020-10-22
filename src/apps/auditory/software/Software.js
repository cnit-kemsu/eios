import React from 'react'

import SoftwareList from './SoftwareList'
import Loading from '../Loading'
import EditSoftwareForm from './EditSoftwareForm'



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