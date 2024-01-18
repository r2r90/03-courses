"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoursesRouter = exports.getCourseViewModel = void 0;
const express_1 = __importDefault(require("express"));
const statuses_1 = require("../statuses");
const getCourseViewModel = (dbCourse) => {
    return {
        id: dbCourse.id,
        title: dbCourse.title
    };
};
exports.getCourseViewModel = getCourseViewModel;
const getCoursesRouter = (db) => {
    const router = express_1.default.Router();
    router.get('/', (req, res) => {
        let foundedCourses = db.courses;
        if (req.query.title) {
            foundedCourses = foundedCourses.filter((c) => c.title.indexOf(req.query.title) > -1);
        }
        res.json(foundedCourses.map(exports.getCourseViewModel));
    });
    router.get('/:id', (req, res) => {
        let foundCourse = db.courses.find(c => c.id === +req.params.id);
        if (!foundCourse) {
            res.sendStatus(statuses_1.HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        res.json((0, exports.getCourseViewModel)(foundCourse));
    });
    router.post('/', (req, res) => {
        if (!req.body.title) {
            res.sendStatus(statuses_1.HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }
        let createdCourse = {
            id: +(new Date()),
            title: req.body.title,
            studentsCount: 0
        };
        db.courses.push(createdCourse);
        res.status(statuses_1.HTTP_STATUSES.CREATED_201).json((0, exports.getCourseViewModel)(createdCourse));
    });
    router.delete('/:id', (req, res) => {
        db.courses = db.courses.filter(c => c.id !== +req.params.id);
        res.sendStatus(statuses_1.HTTP_STATUSES.NO_CONTENT_204);
    });
    router.put('/:id', (req, res) => {
        if (!req.body.title) {
            res.sendStatus(statuses_1.HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }
        let foundCourse = db.courses.find(c => c.id === +req.params.id);
        if (!foundCourse) {
            res.sendStatus(statuses_1.HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        foundCourse.title = req.body.title;
        res.sendStatus(204).json(foundCourse);
    });
    return router;
};
exports.getCoursesRouter = getCoursesRouter;
