import request from "supertest"
import {CreateCourseModel} from "../../src/models/CreateCourseModel";
import {UpdateCourseModel} from "../../src/models/UpdateCourseModel";
import {app} from "../../src/app";
import {HTTP_STATUSES} from "../../src/statuses";



describe('/courses', () => {

    beforeAll(async () => {
        await request(app).delete('/__test__/data')
    })

    it("should return 200 and empty array", async () => {
        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it("should return 404 for not existing course", async () => {
        await request(app)
            .get('/courses/1')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it("shouldn't create course with incorrect input data", async () => {
        const data: CreateCourseModel = {title: ''};

        await request(app)
            .post('/courses')
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    });


    let createdCourse1: any = null
    it("should create course with correct input data", async () => {
        const data: CreateCourseModel = {title: 'test created course'};
        const createCourseResponse = await request(app)
            .post('/courses')
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201)

        createdCourse1 = createCourseResponse.body

        expect(createdCourse1).toEqual({
            id: expect.any(Number),
            title: 'test created course'
        })

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [createdCourse1])
    });

    let createdCourse2: any = null
    it("create one more course", async () => {

        const data: CreateCourseModel = {title: 'test created on more course'};


        const createCourseResponse = await request(app)
            .post('/courses')
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201)

        createdCourse2 = createCourseResponse.body

        expect(createdCourse2).toEqual({
            id: expect.any(Number),
            title: 'test created on more course'
        })

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [createdCourse1, createdCourse2])
    });


    it("shouldn't update course with incorrect input data", async () => {
        const data: UpdateCourseModel = {title: ''};
        await request(app)
            .put('/courses/' + createdCourse1.id)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/courses/' + createdCourse1.id)
            .expect(HTTP_STATUSES.OK_200, createdCourse1)
    });

    it("shouldn't update course than not exist", async () => {
        const data: UpdateCourseModel = {title: 'good title'}
        await request(app)
            .put('/courses/' + -100)
            .send(data)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    });


    it("should update course with correct input data", async () => {
        const data: UpdateCourseModel = {title: 'good updated title'}

        await request(app)
            .put('/courses/' + createdCourse1.id)
            .send(data)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get('/courses/' + createdCourse1.id)
            .expect(HTTP_STATUSES.OK_200, {...createdCourse1, title: data.title})

        await request(app)
            .get('/courses/' + createdCourse2.id)
            .expect(HTTP_STATUSES.OK_200, createdCourse2)

    });

    it("should delete both courses", async () => {
        await request(app)
            .delete('/courses/' + createdCourse1.id)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get('/courses/' + createdCourse1.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .delete('/courses/' + createdCourse2.id)
            .send({title: 'good updated title'})
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get('/courses/' + createdCourse2.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])

    });


})