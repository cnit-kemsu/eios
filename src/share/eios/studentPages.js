export const studentPages = selectedName => [
    { url: '/student-personal-data', title: 'Личные данные', selected: selectedName === 'data' },
    { url: '/personal-area', title: 'Личный кабинет', selected: selectedName === 'personal' },
    { url: '/study-cards', title: 'Учебные карты', selected: selectedName === 'cards' },
]