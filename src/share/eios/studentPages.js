export const studentPages = selectedName => [
    { url: '/home/student-personal-data', title: 'Личные данные', selected: selectedName === 'data' },
    { url: '/home/personal-area', title: 'Личный кабинет', selected: selectedName === 'personal' },
    { url: '/home/study-cards', title: 'Учебные карты', selected: selectedName === 'cards' },
    { url: '/home/study-plans', title: 'Учебные планы', selected: selectedName === 'plans' },    
    { url: '/home/student-portfolio', title: 'Портфолио', selected: selectedName === 'portfolio' } 
]