import { usersCoursesBindingsTestManager } from "../../src/utils/usersCoursesBindingsTestManager";

import request from "supertest";
import { app, RouterPaths } from "../../src/app";
import { CreateUserCourseBindingModel } from "../../src/features/users-courses-bindings/models/CreateUserCourseBindingModel";
import { usersTestManager } from "../../src/utils/usersTestManager";
import { coursesTestManager } from "../../src/utils/coursesTestManager";

const getRequest = () => {
  return request(app);
};

describe("USERS COURSES BINDINGS ", () => {
  beforeAll(async () => {
    await getRequest().delete(`${RouterPaths.__test__}/data`);
  });

  it("should create entity with correct input data", async () => {
    const createUserResult = await usersTestManager.createUser({
      userName: "artur",
    });

    const createCourseResult = await coursesTestManager.createCourse({
      title: "front-end",
    });
    const data: CreateUserCourseBindingModel = {
      userId: createUserResult.createdEntity.id,
      courseId: createCourseResult.createdEntity.id,
    };
    await usersCoursesBindingsTestManager.createBinding(data);
  });

  afterAll((done) => done());
});
