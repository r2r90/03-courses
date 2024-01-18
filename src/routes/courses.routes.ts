import express, {Response} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../types";
import {QueryCourseModel} from "../models/QueryCourseModel";
import {CourseViewModel} from "../models/CourseViewModel";
import {CourseType, DBType} from "../db/db";
import {URIParamsCourseIdModel} from "../models/URIParamsCourseIdModel";
import {CreateCourseModel} from "../models/CreateCourseModel";
import {UpdateCourseModel} from "../models/UpdateCourseModel";
import {HTTP_STATUSES} from "../statuses";


export const getCourseViewModel = (dbCourse: CourseType): CourseViewModel => {
    return {
        id: dbCourse.id,
        title: dbCourse.title
    }
}

export const getCoursesRouter = (db: DBType) => {

    const router = express.Router()

    router.get('/', (req: RequestWithQuery<QueryCourseModel>, res: Response<CourseViewModel[]>) => {
        let foundedCourses = db.courses
        if (req.query.title) {
            foundedCourses = foundedCourses.filter((c) => c.title.indexOf(req.query.title as string) > -1)
        }
        res.json(foundedCourses.map(getCourseViewModel))
    })

    router.get('/:id', (req: RequestWithParams<URIParamsCourseIdModel>, res: Response<CourseViewModel>) => {

        let foundCourse = db.courses.find(c => c.id === +req.params.id);
        if (!foundCourse) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.json(getCourseViewModel(foundCourse))
    })

    router.post('/', (req: RequestWithBody<CreateCourseModel>, res: Response<CourseViewModel>) => {

        if (!req.body.title) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return
        }

        let createdCourse: CourseType = {
            id: +(new Date()),
            title: req.body.title,
            studentsCount: 0
        };


        db.courses.push(createdCourse)


        res.status(HTTP_STATUSES.CREATED_201).json(getCourseViewModel(createdCourse))
    })

    router.delete('/:id', (req: RequestWithParams<URIParamsCourseIdModel>, res) => {
        db.courses = db.courses.filter(c => c.id !== +req.params.id);
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

    router.put('/:id', (req: RequestWithParamsAndBody<{
            id: string
        }, UpdateCourseModel>, res: Response<CourseType>) => {
            if (!req.body.title) {
                res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
                return
            }
            let foundCourse = db.courses.find(c => c.id === +req.params.id);
            if (!foundCourse) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }
            foundCourse.title = req.body.title
            res.sendStatus(204).json(foundCourse)
        }
    )

    return router


}