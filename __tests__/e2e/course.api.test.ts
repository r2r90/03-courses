import request from "supertest"
import {CreateCourseModel} from "../../src/features/courses/models/CreateCourseModel";
import {UpdateCourseModel} from "../../src/features/courses/models/UpdateCourseModel";
import {HTTP_STATUSES} from "../../src/statuses";
import {app, RouterPaths} from "../../src/app";
import {coursesTestManager} from "../../src/utils/coursesTestManager";

const getRequest = () => {
    return request(app)
}
describe('/courses', () => {

    beforeAll(async () => {
        await getRequest().delete('/__test__/data')
    })

    it("should return 200 and empty array", async () => {
        await getRequest()
            .get(RouterPaths.courses)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it("should return 404 for not existing course", async () => {
        await getRequest()
            .get(`${RouterPaths.courses}/1`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it("shouldn't create course with incorrect input data", async () => {
        const data: CreateCourseModel = {title: ''};

        await coursesTestManager.createCourse(data, HTTP_STATUSES.BAD_REQUEST_400)


        await getRequest()
            .get(RouterPaths.courses)
            .expect(HTTP_STATUSES.OK_200, [])
    });


    let createdCourse1: any = null
    it("should create course with correct input data", async () => {
        const data: CreateCourseModel = {title: 'test created course'};

        const result = await coursesTestManager.createCourse(data, HTTP_STATUSES.CREATED_201)

        createdCourse1 =  result.createdEntity

        expect(createdCourse1).toEqual({
            id: expect.any(Number),
            title: 'test created course'
        })

        await getRequest()
            .get(RouterPaths.courses)
            .expect(HTTP_STATUSES.OK_200, [createdCourse1])
    });

    let createdCourse2: any = null
    it("create one more course", async () => {

        const data: CreateCourseModel = {title: 'test created on more course'};


        const result = await coursesTestManager.createCourse(data, HTTP_STATUSES.CREATED_201)

        createdCourse2 =  result.createdEntity

        await getRequest()
            .get(RouterPaths.courses)
            .expect(HTTP_STATUSES.OK_200, [createdCourse1, createdCourse2])
    });


    it("shouldn't update course with incorrect input data", async () => {
        const data: UpdateCourseModel = {title: ''};
        await getRequest()
            .put(`${RouterPaths.courses}/${createdCourse1.id}`)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await getRequest()
            .get(`${RouterPaths.courses}/${createdCourse1.id}`)
            .expect(HTTP_STATUSES.OK_200, createdCourse1)
    });

    it("shouldn't update course than not exist", async () => {
        const data: UpdateCourseModel = {title: 'good title'}
        await getRequest()
            .put(RouterPaths.courses + -100)
            .send(data)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    });


    it("should update course with correct input data", async () => {
        const data: UpdateCourseModel = {title: 'good updated title'}

        await getRequest()
            .put(`${RouterPaths.courses}/${createdCourse1.id}`)
            .send(data)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await getRequest()
            .get(`${RouterPaths.courses}/${createdCourse1.id}`)
            .expect(HTTP_STATUSES.OK_200, {...createdCourse1, title: data.title})

        await getRequest()
            .get(`${RouterPaths.courses}/${createdCourse2.id}`)
            .expect(HTTP_STATUSES.OK_200, createdCourse2)

    });

    it("should delete both courses", async () => {
        await getRequest()
            .delete(`${RouterPaths.courses}/${createdCourse1.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await getRequest()
            .get(`${RouterPaths.courses}/${createdCourse1.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await getRequest()
            .delete(`${RouterPaths.courses}/${createdCourse2.id}`)
            .send({title: 'good updated title'})
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await getRequest()
            .get(`${RouterPaths.courses}/${createdCourse2.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await getRequest()
            .get(RouterPaths.courses)
            .expect(HTTP_STATUSES.OK_200, [])

    });

    afterAll(done => done())


})