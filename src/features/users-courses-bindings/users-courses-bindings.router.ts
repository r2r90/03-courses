import express, { Response } from "express";
import { RequestWithBody } from "../../types";
import {
  CourseType,
  DBType,
  UserCourseBindingType,
  UserType,
} from "../../db/db";
import { HTTP_STATUSES } from "../../statuses";
import { CreateUserCourseBindingModel } from "./models/CreateUserCourseBindingModel";
import { UserCourseBindingViewModel } from "./models/UserCourseBindingViewModel";

export const mapEntityToViewModel = (
  dbEntity: UserCourseBindingType,
  user: UserType,
  course: CourseType
): UserCourseBindingViewModel => {
  return {
    userId: dbEntity.userId,
    courseId: dbEntity.courseId,
    userName: user.userName,
    courseTitle: course.title,
  };
};

export const getUsersCoursesBindingsRouter = (db: DBType) => {
  const router = express.Router();

  router.post(
    "/",
    (
      req: RequestWithBody<CreateUserCourseBindingModel>,
      res: Response<UserCourseBindingViewModel>
    ) => {
      const user = db.users.find((u) => u.id === req.body.userId);
      const course = db.courses.find((c) => c.id === req.body.courseId);

      if (!user || !course) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
      }

      const alreadyExistingBinding = db.userCourseBindings.find(
        (b) => b.userId === req.body.userId && b.courseId === req.body.courseId
      );

      if (alreadyExistingBinding) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
      }
      let createdEntity: UserCourseBindingType = {
        userId: user.id,
        courseId: course.id,
        date: new Date(),
      };

      db.userCourseBindings.push(createdEntity);

      res
        .status(HTTP_STATUSES.CREATED_201)
        .json(mapEntityToViewModel(createdEntity, user, course));
    }
  );

  return router;
};
