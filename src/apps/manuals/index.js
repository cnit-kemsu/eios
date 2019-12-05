import React from 'react'
import { Helmet } from 'react-helmet'
import { css } from '@emotion/core'

import { userIsStudent } from 'share/utils'


const studManuals = [
    { title: 'Руководство пользователя для обучающегося по системе БРС ', file: 'Руководство пользователя по системе БРС - обучающийся 2019.docx' }
]

const employeeManuals = [
    { title: 'Руководство пользователя для преподавателя по системе БРС', file: 'Руководство пользователя по системе БРС - преподаватель 2018.doc' },
    { title: 'Руководство пользователя для преподавателя по системе ИнфОУПро', file: 'Руководство пользователя по системе ИнфОУПро - Преподаватель 2018.doc' },
    { title: 'Положение о балльно-рейтинговой системе оценки деятельности обучающихся КемГУ', file: 'student_rating.pdf' },
    { title: 'Положение о проведении текущего контроля и промежуточной аттестации обучающихся', file: 'formi_sroki_kontrolya_301215.pdf' }

]

const linkCss = css`
    display: block;    
    padding: 12px 0px;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`

export function App() {

    const isStudent = userIsStudent()

    return (
        <>
            <Helmet>
                <title>ЭИОС: Руководство пользователя</title>
            </Helmet>
            <h1>Руководство пользователя</h1>
            <div>
                <a css={linkCss} href='http://public.kemsu.ru/eios/docs/Technical_requirements.doc'>Технические требования для работы с системами ЭИОС</a>
                {isStudent !== null && (
                    (isStudent ? studManuals : employeeManuals).map((manual, i) => (
                        <a key={i} css={linkCss} href={`http://public.kemsu.ru/eios/docs/${manual.file}`}>{manual.title}</a>
                    ))
                )}

                <a css={linkCss} href='http://public.kemsu.ru/eios/docs/Инструкция по пользованию сайтом_видеоконференции.doc'>Инструкция по созданию видеоконференции RUNNet</a>
                <a css={linkCss} href='http://public.kemsu.ru/eios/docs/инстр_ВКР.pdf'>Инструкция по размещению ВКР</a>

                {
                    isStudent === null && (
                        <p style={{
                            'color': 'red',
                            'font-size': '16px'
                        }}>
                            Руководство по системам для преподавателей и обучающихся будут доступны после входа в систему!
                        </p>
                    )
                }
            </div>
        </>
    )
}

export { default as Layout } from 'share/eios/layout/Layout'