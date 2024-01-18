"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../src/app");
const statuses_1 = require("../../src/statuses");
describe('/courses', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app).delete('/__test__/data');
    }));
    it("should return 200 and empty array", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .get('/courses')
            .expect(statuses_1.HTTP_STATUSES.OK_200, []);
    }));
    it("should return 404 for not existing course", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .get('/courses/1')
            .expect(statuses_1.HTTP_STATUSES.NOT_FOUND_404);
    }));
    it("shouldn't create course with incorrect input data", () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: '' };
        yield (0, supertest_1.default)(app_1.app)
            .post('/courses')
            .send(data)
            .expect(statuses_1.HTTP_STATUSES.BAD_REQUEST_400);
        yield (0, supertest_1.default)(app_1.app)
            .get('/courses')
            .expect(statuses_1.HTTP_STATUSES.OK_200, []);
    }));
    let createdCourse1 = null;
    it("should create course with correct input data", () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: 'test created course' };
        const createCourseResponse = yield (0, supertest_1.default)(app_1.app)
            .post('/courses')
            .send(data)
            .expect(statuses_1.HTTP_STATUSES.CREATED_201);
        createdCourse1 = createCourseResponse.body;
        expect(createdCourse1).toEqual({
            id: expect.any(Number),
            title: 'test created course'
        });
        yield (0, supertest_1.default)(app_1.app)
            .get('/courses')
            .expect(statuses_1.HTTP_STATUSES.OK_200, [createdCourse1]);
    }));
    let createdCourse2 = null;
    it("create one more course", () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: 'test created on more course' };
        const createCourseResponse = yield (0, supertest_1.default)(app_1.app)
            .post('/courses')
            .send(data)
            .expect(statuses_1.HTTP_STATUSES.CREATED_201);
        createdCourse2 = createCourseResponse.body;
        expect(createdCourse2).toEqual({
            id: expect.any(Number),
            title: 'test created on more course'
        });
        yield (0, supertest_1.default)(app_1.app)
            .get('/courses')
            .expect(statuses_1.HTTP_STATUSES.OK_200, [createdCourse1, createdCourse2]);
    }));
    it("shouldn't update course with incorrect input data", () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: '' };
        yield (0, supertest_1.default)(app_1.app)
            .put('/courses/' + createdCourse1.id)
            .send(data)
            .expect(statuses_1.HTTP_STATUSES.BAD_REQUEST_400);
        yield (0, supertest_1.default)(app_1.app)
            .get('/courses/' + createdCourse1.id)
            .expect(statuses_1.HTTP_STATUSES.OK_200, createdCourse1);
    }));
    it("shouldn't update course than not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: 'good title' };
        yield (0, supertest_1.default)(app_1.app)
            .put('/courses/' + -100)
            .send(data)
            .expect(statuses_1.HTTP_STATUSES.NOT_FOUND_404);
    }));
    it("should update course with correct input data", () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: 'good updated title' };
        yield (0, supertest_1.default)(app_1.app)
            .put('/courses/' + createdCourse1.id)
            .send(data)
            .expect(statuses_1.HTTP_STATUSES.NO_CONTENT_204);
        yield (0, supertest_1.default)(app_1.app)
            .get('/courses/' + createdCourse1.id)
            .expect(statuses_1.HTTP_STATUSES.OK_200, Object.assign(Object.assign({}, createdCourse1), { title: data.title }));
        yield (0, supertest_1.default)(app_1.app)
            .get('/courses/' + createdCourse2.id)
            .expect(statuses_1.HTTP_STATUSES.OK_200, createdCourse2);
    }));
    it("should delete both courses", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .delete('/courses/' + createdCourse1.id)
            .expect(statuses_1.HTTP_STATUSES.NO_CONTENT_204);
        yield (0, supertest_1.default)(app_1.app)
            .get('/courses/' + createdCourse1.id)
            .expect(statuses_1.HTTP_STATUSES.NOT_FOUND_404);
        yield (0, supertest_1.default)(app_1.app)
            .delete('/courses/' + createdCourse2.id)
            .send({ title: 'good updated title' })
            .expect(statuses_1.HTTP_STATUSES.NO_CONTENT_204);
        yield (0, supertest_1.default)(app_1.app)
            .get('/courses/' + createdCourse2.id)
            .expect(statuses_1.HTTP_STATUSES.NOT_FOUND_404);
        yield (0, supertest_1.default)(app_1.app)
            .get('/courses')
            .expect(statuses_1.HTTP_STATUSES.OK_200, []);
    }));
});
