"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonBodyMiddleware = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("./db/db");
const tests_routes_1 = require("./routes/tests.routes");
const courses_routes_1 = require("./routes/courses.routes");
exports.app = (0, express_1.default)();
exports.jsonBodyMiddleware = express_1.default.json();
exports.app.use(exports.jsonBodyMiddleware);
exports.app.use("/courses", (0, courses_routes_1.getCoursesRouter)(db_1.db));
exports.app.use("/__test__", (0, tests_routes_1.getTestsRouter)(db_1.db));
