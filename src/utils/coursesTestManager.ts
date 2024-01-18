import {app, RouterPaths} from "../app";
import {HTTP_STATUSES, HttpStatusType} from "../statuses";
import request from "supertest";
import {CreateCourseModel} from "../features/courses/models/CreateCourseModel";


export const coursesTestManager = {
    async createCourse(data: CreateCourseModel, expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
        const response = await request(app)
            .post(RouterPaths.courses)
            .send(data)
            .expect(expectedStatusCode)

        let createdEntity;

        if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
            createdEntity = response.body

            expect(createdEntity).toEqual({
                id: expect.any(Number),
                title: data.title
            })
        }

        return {response, createdEntity}

    }


}