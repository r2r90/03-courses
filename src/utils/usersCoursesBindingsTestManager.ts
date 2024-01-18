import { app, RouterPaths } from "../app";
import { HTTP_STATUSES, HttpStatusType } from "../statuses";
import request from "supertest";
import { CreateUserCourseBindingModel } from "../features/users-courses-bindings/models/CreateUserCourseBindingModel";

export const usersCoursesBindingsTestManager = {
  async createBinding(
    data: CreateUserCourseBindingModel,
    expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201
  ) {
    const response = await request(app)
      .post(RouterPaths.usersCoursesBindings)
      .send(data)
      .expect(expectedStatusCode);

    let createdEntity;

    if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
      createdEntity = response.body;

      expect(createdEntity).toEqual({
        userId: data.userId,
        courseId: data.courseId,
        userName: expect.any(String),
        courseTitle: expect.any(String),
      });
    }

    return { response, createdEntity };
  },
};
