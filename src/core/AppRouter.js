import React, { lazy, useMemo, useReducer, Suspense, Fragment } from 'react'
import Page404 from './Page404'

const layoutInitialValue = { Layout: Fragment, layoutProps: {} }

async function getLayoutFromModule(module) {

    const summaryLayoutProps = module.layoutProps || {}
    const asyncLayoutProps = module.asyncLayoutProps || {}
    const funcLayoutProps = module.funcLayoutProps || {}

    for (const [propName, propValue] of Object.entries(asyncLayoutProps)) {

        if(typeof propValue !== 'function') throw new Error('Значения полей asyncLayoutProps должны быть асинхронными функциями')

        summaryLayoutProps[propName] = await propValue()
    }

    for (const [propName, propValue] of Object.entries(funcLayoutProps)) {

        if(typeof propValue !== 'function') throw new Error('Значения полей funcLayoutProps должны быть функциями')

        summaryLayoutProps[propName] = propValue(summaryLayoutProps)
    }

    return {
        Layout: module.Layout,
        layoutProps: summaryLayoutProps
    }

}

export default function AppRouter({ appName }) {

    const [{ Layout, layoutProps }, setLayout] = useReducer(
        (prevState, newState) => ({ ...prevState, ...newState }),
        layoutInitialValue
    )

    const App = useMemo(() => lazy(async () => {
        try {

            let appModule = await import(`/apps/${appName}/index.js`)

            let appLayout = await getLayoutFromModule(appModule)

            if (!appModule.default && !appModule.getAppPage) throw new Error('Модуль приложения должен экспортировать либо компонент (экспорт по умолчанию), либо функцию getPageApp (именованный экспорт)')

            if (appModule.getAppPage) {
                const pageModule = await appModule.getAppPage()

                if (!pageModule.default) throw new Error('Модуль страницы приложения должен экспортировать компонент (экспорт по умолчанию)')

                const pageLayout = await getLayoutFromModule(pageModule)

                if (pageLayout.Layout) appLayout.Layout = pageLayout.Layout
                appLayout.layoutProps = Object.assign({}, appLayout.layoutProps, pageLayout.layoutProps)

                appModule.default = pageModule.default
            }

            if (appLayout.Layout) {
                setLayout(appLayout)
            } else if (Layout) {
                setLayout(layoutInitialValue)
            }

            return appModule

        } catch (err) {
            console.error(err)
            return { default: Page404 }
        }
    }), [location.pathname])    

    return (
        <Layout {...layoutProps}>
            <Suspense fallback={'Загрузка...'}>
                <App appName={appName} setLayout={setLayout} />
            </Suspense>
        </Layout>
    )
}