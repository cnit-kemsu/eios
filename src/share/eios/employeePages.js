export const employeePages = selectedName => [
    { url: '/home/personal-area', title: 'Личный кабинет преподавателя', selected: selectedName === 'personal' },
    { url: '/home/employee-area', title: 'Кабинет сотрудника', selected: selectedName === 'employee' },
    { url: '/home/admin-area', title: 'Кабинет администратора', selected: selectedName === 'admin' },
]