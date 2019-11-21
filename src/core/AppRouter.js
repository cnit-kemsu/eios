import React, { useEffect, useReducer, Fragment, useCallback } from 'react'
import Page404 from './Page404'

const stateInitialValue = { App: () => 'Загрузка...', Layout: Fragment, layoutProps: {} }


async function getLayoutPropsFromModule(module) {

    const summaryLayoutProps = module.layoutProps || {}
    const asyncLayoutProps = module.asyncLayoutProps || {}
    const funcLayoutProps = module.funcLayoutProps || {}

    for (const [propName, propValue] of Object.entries(asyncLayoutProps)) {

        if (typeof propValue !== 'function') throw new Error('Значения полей asyncLayoutProps должны быть асинхронными функциями')

        summaryLayoutProps[propName] = await propValue()
    }

    for (const [propName, propValue] of Object.entries(funcLayoutProps)) {

        if (typeof propValue !== 'function') throw new Error('Значения полей funcLayoutProps должны быть функциями')

        summaryLayoutProps[propName] = propValue(summaryLayoutProps)
    }

    return summaryLayoutProps

}

class InvalidAppModuleError extends Error { }


export default function AppRouter({ setError, appName }) {

    const [{ App, Layout, layoutProps }, setState] = useReducer(
        (prevState, newState) => ({ ...prevState, ...newState }),
        stateInitialValue
    )

    const setLayoutProps = useCallback((layoutProps) => setState({ layoutProps }), [setState])

    useEffect(() => {
        (async () => {
            try {

                // импортируем модуль приложения
                let appModule = await import(
                    /* webpackMode: "lazy-once" */
                    /* webpackChunkName: "apps" */
                    `../apps/${appName}/index.js`
                )

                // при наличии, считываем свойства макета из модуля
                let layoutProps = await getLayoutPropsFromModule(appModule)

                // если была экспортирована функция appGenerator, загружаем с ее помощью модуль приложения
                if (appModule.appGenerator) {

                    let pageModule = appModule.appGenerator()
                    // функция может быть асинхронной
                    if (pageModule.then) pageModule = await pageModule

                    // загружаем свойства макета, если они есть
                    const pageLayoutProps = await getLayoutPropsFromModule(pageModule)

                    // сам макет
                    if (pageModule.Layout) appModule.Layout = pageModule.Layout

                    layoutProps = Object.assign({}, layoutProps, pageLayoutProps)
                    appModule.default = pageModule.default || pageModule.Page
                }

                if (!appModule.default && !appModule.App && !appModule.Page) throw new InvalidAppModuleError('Модуль приложения (страницы) должен содержать компонент, экспортированный по умолчанию или с помощью именованного экспорта с именем App или Page')

                if (appModule.Layout) {
                    setState({ App: appModule.default || appModule.App || !appModule.Page, Layout: appModule.Layout, layoutProps })
                } else if (Layout) {
                    setState({ ...stateInitialValue, App: appModule.default || appModule.App || !appModule.Page })
                }

            } catch (err) {
                if (err instanceof InvalidAppModuleError) {
                    setError(err.message)
                } else {
                    setState({ App: Page404, Layout: Fragment, layoutProps: {} })
                }
            }
        })()


    }, [location.pathname])

    if (Layout !== Fragment) layoutProps['setError'] = setError

    return (
        <Layout {...layoutProps}>
            <App setError={setError} appName={appName} setLayoutProps={setLayoutProps} />
        </Layout>
    )
}