import $ from 'jquery'


export function getBlocksFrom(self, xml) {

    let blockNodes = xml.find("ПланыЦиклы[ТипБлока=1],ПланыЦиклы[ТипБлока=4]"),
        blocks = []

    Array.prototype.forEach.call(blockNodes, blockNode => {
        blockNode = $(blockNode)

        let code = blockNode.attr("Идентификатор")
        let name = blockNode.attr("Цикл")

        if (!name) return

        code = code || "Б4"

        let isSubblock = code !== 'К.М' && code.split('.').length > 1

        blocks.push({
            code: code == 'К.М' ? 'КМ' : code,
            name: name,
            isSubblock: isSubblock
        })
    })

    return blocks

}

export function getPlanInfo(self, xml) {

    let plNode = xml.find('Планы')

    let learnFormCode = plNode.attr('КодФормыОбучения')

    let years = plNode.attr('СрокОбучения')

    if (plNode.attr('СрокОбученияМесяцев') && plNode.attr('СрокОбученияМесяцев') !== '0') {
        years = `${years},${plNode.attr('СрокОбученияМесяцев')}`
    }

    let approvalDate = plNode.attr('ДатаУтверСоветом')
    let learnForm = learnFormCode === '1' ? 'очная' : learnFormCode === '2' ? 'заочная' : 'очно-заочная'

    return {
        years: years,
        approvalDate: approvalDate && new Date(approvalDate),
        learnForm: learnForm
    }
}


function getHour(hourNodes, code) {
    try {
        let filtered = hourNodes.filter(`[КодВидаРаботы=${code}]`)

        if (filtered.length > 0) {
            return $(filtered.filter('[КодТипаЧасов="1"]')[0]).attr("Количество")
        }

        return $(filtered[0]).attr("Количество")
    } catch(e) {
        return 0
    }
}

export function getPlanRowsFrom(self, xml) {

    let planRowNodes = $.makeArray(xml.find("ПланыСтроки").not("[ТипОбъекта=3],[ТипОбъекта=5]"))
    planRowNodes = planRowNodes.concat(xml.find("ПланыСтроки[Дисциплина='Элективные дисциплины по физической культуре и спорту']"))

    let planRows = []

    let planInfo = getPlanInfo(self, xml)

    let semCount = 2
    let semTitle = 'Семестр'

    if (planInfo.learnForm === 'заочная') {
        semCount = 3
        semTitle = 'Сессия'
    }

    let electCode = null
    

    Array.prototype.forEach.call(planRowNodes, planRowNode => {

        planRowNode = $(planRowNode)

        let allHourNodes = xml.find(`ПланыНовыеЧасы[КодОбъекта=${planRowNode.attr("Код")}]`)
        let semesters = []

        for (let course = 1; course <= 8; ++course) {
            for (let relSem = 1; relSem < 4; ++relSem) {

                let hourNodes = allHourNodes.filter(`[Курс=${course}][${semTitle}=${relSem}]`)

                if (hourNodes.length === 0) continue

                let semester = (course - 1) * semCount + relSem
                let reportTypeIds = []

                // Определяем формы контроля
                if (hourNodes.filter("[КодВидаРаботы=1]").length) {
                    reportTypeIds.push(112)
                }
                if (hourNodes.filter("[КодВидаРаботы=2]").length) {
                    reportTypeIds.push(113)
                }
                if (hourNodes.filter("[КодВидаРаботы=3]").length) {
                    reportTypeIds.push(7581)
                }
                if (hourNodes.filter("[КодВидаРаботы=5]").length) {
                    reportTypeIds.push(277)
                }

                // Для ФГОС3++ вместо контрольной работы используется курсовой проект, поэтому здесь две проверки
                if (hourNodes.filter("[КодВидаРаботы=6]").length || hourNodes.filter("[КодВидаРаботы=4]").length) {
                    reportTypeIds.push(3978)
                }

                /*let lecture = $(hourNodes.filter(`[КодВидаРаботы=101]`)[0]).attr("Количество")
                let lab = $(hourNodes.filter(`[КодВидаРаботы=102]`)[0]).attr("Количество")
                let pract = $(hourNodes.filter(`[КодВидаРаботы=103]`)[0]).attr("Количество")
                let ksr = $(hourNodes.filter(`[КодВидаРаботы=108]`)[0]).attr("Количество")
                let srs = $(hourNodes.filter(`[КодВидаРаботы=107]`)[0]).attr("Количество")
                let zet = $(hourNodes.filter(`[КодВидаРаботы=50]`)[0]).attr("Количество")*/

                let lecture = getHour(hourNodes, $(xml.find('СправочникВидыРабот[Аббревиатура="Лек"]')).attr('Код'))
                let lab = getHour(hourNodes, $(xml.find('СправочникВидыРабот[Аббревиатура="Лаб"]')).attr('Код'))
                let pract = getHour(hourNodes, $(xml.find('СправочникВидыРабот[Аббревиатура="Пр"]')).attr('Код'))

                let control = getHour(hourNodes, $(xml.find('СправочникВидыРабот[Аббревиатура="Контроль"]')).attr('Код'))
                let ksr = getHour(hourNodes, $(xml.find('СправочникВидыРабот[Аббревиатура="КСР"]')).attr('Код'))

                if(control) {
                    ksr = (ksr ? +ksr : 0) + (+control)
                }               
                

                let srs = getHour(hourNodes, $(xml.find('СправочникВидыРабот[Аббревиатура="СР"]')).attr('Код'))
                let zet = getHour(hourNodes, $(xml.find('СправочникВидыРабот[Аббревиатура="ЗЕТ"]')).attr('Код'))

                //let kre, krkr, krpr, krgia, krkp

                /*try { kre = $(hourNodes.filter(`[КодВидаРаботы=143]`)[0]).attr("Количество") } catch (e) { }
                try { krkr = $(hourNodes.filter(`[КодВидаРаботы=144]`)[0]).attr("Количество") } catch (e) { }
                try { krpr = $(hourNodes.filter(`[КодВидаРаботы=145]`)[0]).attr("Количество") } catch (e) { }
                try { krgia = $(hourNodes.filter(`[КодВидаРаботы=146]`)[0]).attr("Количество") } catch (e) { }
                try { krkp = $(hourNodes.filter(`[КодВидаРаботы=147]`)[0]).attr("Количество") } catch (e) { }*/

                let kre = getHour(hourNodes, $(xml.find('СправочникВидыРабот[Аббревиатура="КРэ"],СправочникВидыРабот[Аббревиатура="КРЭ"]')).attr('Код'))
                let krkr = getHour(hourNodes, $(xml.find('СправочникВидыРабот[Аббревиатура="КРкр"]')).attr('Код'))
                let krpr = getHour(hourNodes, $(xml.find('СправочникВидыРабот[Аббревиатура="КРпр"]')).attr('Код'))
                let krgia = getHour(hourNodes, $(xml.find('СправочникВидыРабот[Аббревиатура="КРгиа"]')).attr('Код'))
                let krkp = getHour(hourNodes, $(xml.find('СправочникВидыРабот[Аббревиатура="КРкп"]')).attr('Код'))

                if (relSem === 1 && semCount === 3) {
                    zet = $(allHourNodes.filter(`[Курс=${course}][${semTitle}=${0}]`).filter(`[КодВидаРаботы=50]`)[0]).attr("Количество")
                }

                semesters.push({
                    num: semester,
                    lecture: lecture,
                    lab: lab,
                    pract: pract,
                    ksr: ksr,
                    srs: srs,
                    zet: zet,
                    kre, krkr, krpr, krgia, krkp,
                    reportTypeIds: reportTypeIds                    

                })
            }
        }

        let code = planRowNode.attr("ДисциплинаКод") || "";
        let name = planRowNode.attr("Дисциплина")

        if (!name) {
            return
        }

        let isElect = name === 'Элективные дисциплины по физической культуре и спорту'

        code = code.startsWith('К.М') ? 'КМ' + code.slice(3) : code

        if (isElect) electCode = code

        planRows.push({
            name: name,
            code: code,
            cathedra: $(xml.find(`Кафедры[Код=${planRowNode.attr("КодКафедры")}]`)[0]).attr('Название'),
            semesters: semesters,
            discTypeId: code.indexOf("ДВ") !== -1 ? (name === 'Элективные дисциплины по физической культуре и спорту' ? /*1249*/ 7540 : 780) : 206,
            physCulture: planRowNode.attr("ПризнакФизкультуры") === "true"

        })
    })

    if (electCode) {
        for (let planRow of planRows) {
            if (planRow.code.startsWith(electCode + '.')) planRow.discTypeId = 206
        }
    }

    return planRows
}

export function getPracticesFrom(self, xml, kind) {

    switch (kind) {
        case 'У': kind = '6'; break
        case 'П': kind = '7'; break
        case 'Н': kind = '8'; break
        case 'Пд': kind = '72'; break
        case 'Д': kind = '15'; break
        case 'С': kind = '22'; break
        case 'Г': kind = '16'; break
    }

    var planRowNodes = xml.find(`ПланыСтроки[ВидПрактики=${kind}][ТипОбъекта=3]`),//.not("[ТипОбъекта=5]"),
        planRows = [];

    let planInfo = getPlanInfo(self, xml)

    let semCount = 2
    let semTitle = 'Семестр'

    if (planInfo.learnForm === 'заочная') {
        semCount = 3
        semTitle = 'Сессия'
    }

    Array.prototype.forEach.call(planRowNodes, planRowNode => {

        planRowNode = $(planRowNode)

        let allHourNodes = xml.find(`ПланыНовыеЧасы[КодОбъекта=${planRowNode.attr("Код")}]`)
        let semesters = []

        for (let course = 1; course < 8; ++course) {
            for (let relSem = 1; relSem < 4; ++relSem) {

                let hourNodes = allHourNodes.filter(`[Курс=${course}][${semTitle}=${relSem}]`)

                if (hourNodes.length === 0) continue

                let semester = (course - 1) * semCount + relSem
                let reportTypeIds = []

                // Определяем формы контроля
                if (hourNodes.filter("[КодВидаРаботы=1]").length) {
                    reportTypeIds.push(112)
                }
                if (hourNodes.filter("[КодВидаРаботы=2]").length) {
                    reportTypeIds.push(113)
                }
                if (hourNodes.filter("[КодВидаРаботы=3]").length) {
                    reportTypeIds.push(7581)
                }
                if (hourNodes.filter("[КодВидаРаботы=5]").length) {
                    reportTypeIds.push(277)
                }
                if (hourNodes.filter("[КодВидаРаботы=6]").length) {
                    reportTypeIds.push(3978)
                }

                let lecture = $(hourNodes.filter(`[КодВидаРаботы=101]`)[0]).attr("Количество")
                let lab = $(hourNodes.filter(`[КодВидаРаботы=102]`)[0]).attr("Количество")
                let pract = $(hourNodes.filter(`[КодВидаРаботы=103]`)[0]).attr("Количество")
                let ksr = $(hourNodes.filter(`[КодВидаРаботы=108]`)[0]).attr("Количество")
                let srs = $(hourNodes.filter(`[КодВидаРаботы=107]`)[0]).attr("Количество")
                let zet = $(hourNodes.filter(`[КодВидаРаботы=50]`)[0]).attr("Количество")

                let kre, krkr, krpr, krgia, krkp

                try { kre = $(hourNodes.filter(`[КодВидаРаботы=143]`)[0]).attr("Количество") } catch (e) { }
                try { krkr = $(hourNodes.filter(`[КодВидаРаботы=144]`)[0]).attr("Количество") } catch (e) { }
                try { krpr = $(hourNodes.filter(`[КодВидаРаботы=145]`)[0]).attr("Количество") } catch (e) { }
                try { krgia = $(hourNodes.filter(`[КодВидаРаботы=146]`)[0]).attr("Количество") } catch (e) { }
                try { krkp = $(hourNodes.filter(`[КодВидаРаботы=147]`)[0]).attr("Количество") } catch (e) { }

                /*let pract = $(hourNodes.filter(`[КодВидаРаботы=103]`)[0]).attr("Количество")
                let zet = $(hourNodes.filter(`[КодВидаРаботы=50]`)[0]).attr("Количество")*/

                semesters.push({
                    num: semester,
                    lecture: lecture,
                    lab: lab,
                    pract: pract,
                    ksr: ksr,
                    srs: srs,
                    zet: zet,
                    kre, krkr, krpr, krgia, krkp,
                    /*pract: pract,
                    zet: zet,*/
                    reportTypeIds: reportTypeIds
                })
            }
        }

        /*let allHours = xml.find(`ПланыНовыеЧасы[КодОбъекта=${planRowNode.attr("Код")}]`)

        let controlFormNodes = allHours
            // Оставляем только Экзамены, Зачеты, Зачеты с оценкой, Курсовые и Контрольные
            .filter('[КодВидаРаботы=1],[КодВидаРаботы=2],[КодВидаРаботы=3],[КодВидаРаботы=5],[КодВидаРаботы=6]'),
            semesters = []

        Array.prototype.forEach.call(controlFormNodes, (controlFormNode) => {

            controlFormNode = $(controlFormNode);

            var reportTypeId;

            if (controlFormNode.attr("КодВидаРаботы") === "1") {
                reportTypeId = 112
            } else if (controlFormNode.attr("КодВидаРаботы") === "2") {
                reportTypeId = 113
            } else if (controlFormNode.attr("КодВидаРаботы") === "3") {
                reportTypeId = 7581
            } else if (controlFormNode.attr("КодВидаРаботы") === "5") {
                reportTypeId = 277
            } else if (controlFormNode.attr("КодВидаРаботы") === "6") {
                reportTypeId = 3978
            }

            if (!reportTypeId) return

            let pract = $(allHours.filter('[КодВидаРаботы=103]')[0]).attr("Количество")
            let zet = $(allHours.filter('[КодВидаРаботы=50]')[0]).attr("Количество")

            semesters.push({
                num: ((+controlFormNode.attr("Курс")) - 1) * 2 + (+controlFormNode.attr("Семестр")),
                pract: pract,
                zet: zet,
                reportTypeId: reportTypeId
            });
        })*/

        let code = planRowNode.attr("ДисциплинаКод") || "";

        planRows.push({
            name: planRowNode.attr("Дисциплина"),
            code: code.startsWith('К.М') ? 'КМ' + code.slice(3) : code,
            cathedra: $(xml.find(`Кафедры[Код=${planRowNode.attr("КодКафедры")}]`)[0]).attr('Название'),
            semesters: semesters,
            discTypeId: 206
        })
    })

    return planRows
}

export function getGraphicFrom(self, xml) {

    let graphic = []

    // Для каждого курса
    for (let courseNum = 1; ; ++courseNum) {

        var grCourseNode = xml.find(`ПланыГрафикиЯчейки[Курс=${courseNum}]`)

        if (grCourseNode.length === 0) break

        let accWeekCount = 0

        // Для каждого семестра
        for (let semNum = 1; ; ++semNum) {

            let grSemNodes = grCourseNode.filter(`[Семестр=${semNum}]`)

            if (grSemNodes.length === 0) break

            let graphicArr = [[], [], [], [], [], []]
            let graphicStrs = []
            let firstWeekNum, firstElNum, intNedTO = 0

            Array.prototype.forEach.call(grSemNodes, grSemNode => {

                grSemNode = $(grSemNode)

                let actKind = grSemNode.attr('КодВидаДеятельности')
                let actSymb

                switch (actKind) {
                    case '1': actSymb = 'Т'; break
                    case '3': actSymb = 'Э'; break
                    case '4': actSymb = 'У'; break
                    case '5': actSymb = 'П'; break
                    case '7': actSymb = 'Д'; break
                    case '11': actSymb = 'Г'; break
                    case '12': actSymb = 'К'; break
                    case '13': actSymb = '='; break
                    case '18': actSymb = 'Н'; break
                    default: actSymb = 'К'
                }

                firstWeekNum = +grSemNode.attr('НомерПервойНедели')
                let weekNum = (+grSemNode.attr('НомерНедели')) + firstWeekNum - 1
                let weekPartCount = +grSemNode.attr('КоличествоЧастейВНеделе')
                let weekPartNum = +grSemNode.attr('НомерЧастиНедели')

                let repeats = 6 / weekPartCount
                let startDay = (weekPartNum - 1) * repeats + 1
                let endDay = startDay + repeats

                for (let day = startDay; day < endDay; ++day) {
                    graphicArr[day - 1][weekNum - firstWeekNum] = actSymb
                }

            })

            firstElNum = -1

            let weeks = graphicArr[0].length

            for (let day = 0; day < 6; ++day) {

                let graphicStr = ''
                let weekArr = graphicArr[day]

                for (let week = 0; week < weeks; ++week) {

                    let actSymb = weekArr[week]

                    if (!actSymb) {

                        if (week === 0 && accWeekCount === firstWeekNum && firstElNum < day) {
                            firstElNum = day
                        }
                    }

                    graphicStr += actSymb || '-'
                }

                if (graphicStr) graphicStrs.push(graphicStr)
            }

            accWeekCount += weeks


            for (let day = 0; day < 6; ++day) {
                for (let week = 0; week < graphicStrs[day].length; ++week) {
                    if (graphicStrs[day][week] === 'Т') {
                        ++intNedTO
                    }
                }
            }

            if (intNedTO === 0) break

            graphic.push({
                course: courseNum,
                semester: semNum,
                nedTo: intNedTO,
                graphicStrs: graphicStrs,
                firstWeekNum: firstWeekNum,
                firstElNum: firstElNum + 2
            })

        }

    }

    return graphic;
}