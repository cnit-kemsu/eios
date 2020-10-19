import $ from 'jquery'


export function getBlocksFrom(self, xml) {

    var blockNodes = xml.find("АтрибутыЦикловНов Цикл"),
        blocks = [];

    Array.prototype.forEach.call(blockNodes, (blockNode) => {

        blockNode = $(blockNode);

        var code = blockNode.attr("Аббревиатура");
        var name = blockNode.attr("Название");

        if (!name) return;

        code = code || "Б4"

        var isSubblock = code.split('.').length > 1

        blocks.push({
            code: code,
            name: name,
            isSubblock: isSubblock
        });
    });

    return blocks;
}

export function getPlanInfo(self, xml) {

    let adNode = xml.find('Утверждение')
    let plNode = xml.find('План')
    let kNode = xml.find('Квалификация')

    let adStr = adNode.attr('Дата')
    let [dd, mm, yyyy] = adStr.split('.')
    let ad = new Date(yyyy, mm - 1, dd)

    let [years, months] = kNode.attr('СрокОбучения').split(' ')
    years = years.slice(0, -1)
    months = months && months.slice(0, -1)

    return {
        years: months ? `${years},${months}` : years,
        approvalDate: ad,
        learnForm: plNode.attr('ФормаОбучения')
    }
}

export function getPlanRowsFrom(self, xml) {

    var planRowNodes = xml.find("СтрокиПлана Строка, ДиссерПодготовка ПрочаяПрактика"),
        planRows = [], giaCnt = 1

    Array.prototype.forEach.call(planRowNodes, (planRowNode) => {
        planRowNode = $(planRowNode);

        if (planRowNode.attr("ТипПрактики")) return;

        var semNodes = planRowNode.find("Сем, Семестр, Курс Сессия"),
            semesters = [];

        Array.prototype.forEach.call(semNodes, (semNode) => {
            semNode = $(semNode);

            var reportTypeIds = [];

            if (semNode.attr("Экз")) {
                reportTypeIds.push(112)
            }
            if (semNode.attr("Зач")) {
                reportTypeIds.push(113)
            }
            if (semNode.attr("ЗачО")) {
                reportTypeIds.push(7581)
            }
            if (semNode.attr("КР")) {
                reportTypeIds.push(277)
            }
            if (semNode.attr("КонтрРаб")) {
                reportTypeIds.push(3978)
            }

            let num = +semNode.attr("Ном")

            if (semNode.prop('tagName') === 'Сессия') {
                num = 3 * ((+semNode.parent().attr('Ном')) - 1) + num
            }

            let lecture = semNode.attr("Лек")
            let lab = semNode.attr("Лаб")
            let pract = semNode.attr("Пр") || +semNode.attr("ПланЧасов")
            let ksr = semNode.attr("ЧасЭкз")
            let srs = semNode.attr("СРС")
            let zet = semNode.attr("ЗЕТ") || semNode.attr("ПланЗЕТ") || (((+(lecture || 0)) + (+(lab || 0)) + (+(pract || 0)) + (+(ksr || 0)) + (+(srs || 0))) / 36.0)

            semesters.push({
                num: num,
                lecture: lecture,
                lab: lab,
                pract: pract,
                ksr: ksr,
                srs: srs,
                zet: zet,
                reportTypeIds: reportTypeIds
            });

        });

        let isGia = !!planRowNode.attr("Наименование")
        let code = isGia ? `Б3.Д.${giaCnt}` : planRowNode.attr("НовИдДисциплины") || ""
        let name = isGia ? planRowNode.attr("Наименование") : planRowNode.attr("Дис")

        if (isGia)++giaCnt

        planRows.push({
            name: name,
            code: code,
            cathedra: planRowNode.attr("Кафедра"),
            semesters: semesters,
            discTypeId: isGia ? 206 : code.indexOf("ДВ") !== -1 ? (name === 'Элективные дисциплины по физической культуре и спорту' ? 1249 : 780) : 206
        });
    });

    return planRows;
}

export function getPracticesFrom(self, xml, kind) {

    let tagName

    switch (kind) {
        case 'У': tagName = 'УчебПрактики'; break
        case 'П': tagName = 'ПрочиеПрактики'; break
        case 'Н': tagName = 'НИР'; break
    }

    var planRowNodes = xml.find("СпецВидыРаботНов " + tagName + " ПрочаяПрактика"),
        planRows = []

    let planInfo = getPlanInfo(self, xml)

    let semFactor = 1

    // Для заочных планов, семестры представляют курсы. Поэтому нужно домножить на 3 (так как в заочном плане 3 сессии)
    if (planInfo.learnForm === 'заочная') {
        semFactor = 3
    }

    Array.prototype.forEach.call(planRowNodes, (planRowNode, index) => {

        planRowNode = $(planRowNode)        

        var semNodes = planRowNode.find("Семестр"),
            semesters = []

        Array.prototype.forEach.call(semNodes, (semNode) => {
            semNode = $(semNode);

            var reportTypeIds = [];

            if (semNode.attr("Экз")) {
                reportTypeIds.push(112)
            }
            if (semNode.attr("Зач")) {
                reportTypeIds.push(113)
            }
            if (semNode.attr("ЗачО")) {
                reportTypeIds.push(7581)
            }
            if (semNode.attr("КР")) {
                reportTypeIds.push(277)
            }
            if (semNode.attr("КонтрРаб")) {
                reportTypeIds.push(3978)
            }

            semesters.push({
                num: (+semNode.attr("Ном")) * semFactor - 2,
                zet: semNode.attr("ПланЗЕТ"),
                pract: semNode.attr("ПланЧасов"),
                reportTypeIds: reportTypeIds
            })
        })

        planRows.push({
            name: planRowNode.attr("Наименование"),
            code: "Б2." + kind + "." + (index + 1),
            cathedra: planRowNode.find("Кафедра").attr("Код"),
            semesters: semesters,
            discTypeId: 206
        })
    })

    return planRows;
}

export function getGraphicFrom(self, xml) {
    var courseNodes = xml.find("ГрафикУчПроцесса Курс")
    var graphic = []

    Array.prototype.forEach.call(courseNodes, (courseNode) => {

        courseNode = $(courseNode)

        var semNodes = courseNode.find("Семестр")
        var courseNum = courseNode.attr("Ном")

        Array.prototype.forEach.call(semNodes, (semNode) => {

            semNode = $(semNode)

            var semNum = semNode.attr("Ном")
            var strNedTO = semNode.attr("СтрНедТО")
            var intNedTO
            var firstWeekNum = semNode.attr("НомерПервойНедели")
            var firstElNum = semNode.attr("НомерПервогоЭлемента")
            var graphicStrs = []

            graphicStrs.push(semNode.attr("График"))
            for (let i = 2; i < 7; ++i) {
                var str = semNode.attr("График" + i)
                if (str) {
                    graphicStrs.push(str)
                } else {
                    graphicStrs.push(graphicStrs[0])
                }
            }

            if (strNedTO) {
                var cel_ned = "";
                var ostat = "";
                var probel = false;
                for (let i = 0; i != strNedTO.length; i++) {
                    if (strNedTO[0] === ' ')
                        i++;
                    if (strNedTO[i] === '/') {
                        break;
                    }
                    if (strNedTO[i] === ' ') {
                        probel = true;
                        i++;
                    }
                    if (probel === false) {
                        cel_ned += strNedTO[i];
                    } else {
                        ostat += strNedTO[i];
                    }
                }
                intNedTO = +cel_ned;
                var t;
                if (ostat.length != 0)
                    t = +ostat;
                else t = 0;

                intNedTO = 7 * intNedTO + 2 * t - 1;

                graphic.push({
                    course: courseNum,
                    semester: semNum,
                    nedTo: intNedTO,
                    graphicStrs: graphicStrs,
                    firstWeekNum: firstWeekNum,
                    firstElNum: firstElNum
                });
            }

        });

    });

    return graphic;
}
