import express from "express";
import {db} from "./db/db";
import {getTestsRouter} from "./routes/tests.routes";
import {getCoursesRouter} from "./routes/courses.routes";

export const app = express()
export const jsonBodyMiddleware = express.json()

app.use(jsonBodyMiddleware)

app.use("/courses", getCoursesRouter(db))
app.use("/__test__", getTestsRouter(db))




