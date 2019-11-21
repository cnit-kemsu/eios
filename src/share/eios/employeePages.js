export const employeePages = selectedName => [
    { url: '/personal-area', title: 'Личный кабинет преподавателя', selected: selectedName === 'personal' },
    { url: '/employee-area', title: 'Кабинет сотрудника', selected: selectedName === 'employee' },
    { url: '/admin-area', title: 'Кабинет администратора', selected: selectedName === 'admin' },
]