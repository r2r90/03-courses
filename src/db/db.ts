export type CourseType = {
    id: number,
    title: string
    studentsCount: number
}

export const db: DBType = {
    courses: [
        {id: 1, title: 'front-end', studentsCount: 10},
        {id: 2, title: 'back-end', studentsCount: 10},
        {id: 3, title: 'automation qa', studentsCount: 10},
        {id: 4, title: 'devops', studentsCount: 10},
    ],
    users: [
        {id: 1, userName: 'dimych'},
        {id: 2, userName: 'ivan'},
    ],
    studentCourseBindings: [
        {studentId: 1, courseId: 1, date: new Date(2022, 10, 1)},
        {studentId: 1, courseId: 2, date: new Date(2022, 10, 1)},
        {studentId: 2, courseId: 2, date: new Date(2022, 10, 1)}
    ]
}


export type UserType = {
    id: number,
    userName: string
}

export type StudentCourseBindings = {
    studentId: number,
    courseId: number
    date: Date
}


export type DBType = {
    courses: CourseType[],
    users: UserType[],
    studentCourseBindings: StudentCourseBindings[]
}
