import $ from 'jquery'


export function getBlocksFrom(self, xml) {
    return [{
        code: 'Б1',
        name: 'Дисциплины (модули)'
    }]
}

export function getPlanInfo(self, xml) {

    let plNode = xml.find('Title')

    let learnForm = plNode.attr('ed_form')
    let years = plNode.attr('ed_years')
    let months = plNode.attr('ed_month')

    let ratifNode = plNode.find('Ratif')
    let approvalDate = ratifNode ? ratifNode.attr('RatifDate') : null

    console.log(approvalDate)

    if (approvalDate) {
        const [day, month, year] = approvalDate.split('.')
        approvalDate = new Date(year, month - 1, day)
    }

    if (months && months !== '0') {
        years += ',' + months
    }

    return {
        years,
        approvalDate,
        learnForm,
    }
}

export function getPlanRowsFrom(self, xml) {

    let discNodes = $.makeArray(xml.find('disc'))
    //discNodes = discNodes.concat($.makeArray(xml.find('practice')))

    let planRows = []

    let index = 1

    for (let discNode of discNodes) {

        discNode = $(discNode)

        //let discType = discNode.attr('type')

        let semesterNodes = discNode.find('semester')

        let semesters = []

        for (let semesterNode of semesterNodes) {

            semesterNode = $(semesterNode)

            let reportTypeIds = []

            if (semesterNode.attr('count_ex')) reportTypeIds.push(112)
            if (semesterNode.attr('count_z')) reportTypeIds.push(113)
            if (semesterNode.attr('count_zdif')) reportTypeIds.push(7581)
            if (semesterNode.find('control').filter('[ID=5]').length) reportTypeIds.push(277)


            semesters.push({
                num: semesterNode.attr('num'),
                lecture: semesterNode.attr('lect'),
                lab: semesterNode.attr('lab'),
                pract: semesterNode.attr('pr') || semesterNode.attr('hours'),
                ksr: semesterNode.attr('KP'),
                srs: semesterNode.attr('samN'),
                zet: 0,
                reportTypeIds: reportTypeIds
            })
        }

        if (name) continue

        let code = discNode.attr('index')

        planRows.push({
            name: discNode.attr('name'),
            code: 'Б1.' + index + (code ? ` (${code.replace(/\./g, '_')})` : ''),
            semesters: semesters,
            discTypeId: 206
        })

        ++index
    }



    return planRows.concat(getPractices(xml, planRows.length + 1))
}

function getPractices(xml, index) {

    const blockNodes = xml.find('block')
    const practiceRows = []

    for (let blockNode of blockNodes) {

        blockNode = $(blockNode)
        const practiceNodes = blockNode.find('practice, kv_exams')

        if (practiceNodes.length > 0) {

            practiceRows.push({
                code: `Б1.${index}`,
                name: blockNode.attr('name'),
                discTypeId: 7540
            })

            let j = 1
            for (let practiceNode of practiceNodes) {

                practiceNode = $(practiceNode)

                const semesters = []

                const semNodes = practiceNode.find('semester')

                for (let semNode of semNodes) {
                    semNode = $(semNode)

                    if (
                        semNode.attr('hours')
                        || practiceNode.attr('name') === 'Демонстрационный экзамен'
                        || practiceNode.attr('name') === 'Квалификационный экзамен'
                    ) {

                        const reportTypeIds = []

                        if (semNode.attr('count_ex')) reportTypeIds.push(112)
                        if (semNode.attr('count_z')) reportTypeIds.push(113)
                        if (semNode.attr('count_zdif')) reportTypeIds.push(7581)
                        if (semNode.find('control').filter('[ID=5]').length) reportTypeIds.push(277)

                        semesters.push({
                            num: semNode.attr('num'),
                            pract: semNode.attr('hours'),
                            reportTypeIds: reportTypeIds
                        })
                    }
                }

                let code = practiceNode.attr('index')

                practiceRows.push({
                    code: `Б1.${index}.${j}${(code ? ` (${code.replace(/\./g, '_')})` : '')}`,
                    name: practiceNode.attr('name'),
                    discTypeId: 206,
                    semesters: semesters
                })
                ++j


            }

            ++index
        }
    }

    return practiceRows
}

export function getPracticesFrom(/*self, xml, kind*/) {
    return []
}

export function getGraphicFrom(self, xml) {

    let { years } = getPlanInfo(self, xml)
    let parts = years.split(',')
    years = +parts[0]
    if (parts.length === 2)++years

    let graphic = []

    let graphicStrs = [
        "======================",
        "======================",
        "======================",
        "======================",
        "======================",
        "======================"
    ]

    for (let i = 1; i <= years; ++i) {
        graphic.push({
            course: i, semester: (i - 1) * 2 + 1, graphicStrs
        })
        graphic.push({ course: i, semester: (i - 1) * 2 + 2, graphicStrs })
    }

    return graphic
}