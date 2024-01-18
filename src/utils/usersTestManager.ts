import {app, RouterPaths} from "../app";
import {HTTP_STATUSES, HttpStatusType} from "../statuses";
import {CreateUserModel} from "../features/users/models/CreateUserModel";
import request from "supertest";


export const usersTestManager = {
    async createUser(data: CreateUserModel, expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
        const response = await request(app)
            .post(RouterPaths.users)
            .send(data)
            .expect(expectedStatusCode)

        let createdEntity;

        if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
            createdEntity = response.body

            expect(createdEntity).toEqual({
                id: expect.any(Number),
                userName: data.userName
            })
        }

        return {response, createdEntity}

    }


}