import express from "express";
import {db} from "./db/db";
import {getTestsRouter} from "./routes/tests.routes";
import {getCoursesRouter} from "./features/courses/courses.router";
import {getUsersRouter} from "./features/users/users.router";

export const app = express()
export const jsonBodyMiddleware = express.json()

app.use(jsonBodyMiddleware)

export const RouterPaths = {
    courses: '/courses',
    users: '/users',
    __test__: '/__test__'
}


app.use(RouterPaths.courses, getCoursesRouter(db))
app.use(RouterPaths.users, getUsersRouter(db))
app.use(RouterPaths.__test__, getTestsRouter(db))



