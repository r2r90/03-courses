import express, {Response} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../../types";
import {DBType, UserType} from "../../db/db";
import {HTTP_STATUSES} from "../../statuses";
import {UserViewModel} from "./models/UserViewModel";
import {QueryUserModel} from "./models/QueryUserModel";
import {CreateUserModel} from "./models/CreateUserModel";
import {URIParamsUserIdModel} from "./models/URIParamsUserIdModel";
import {UpdateUserModel} from "./models/UpdateUserModel";


export const mapEntityToViewModel = (dbEntity: UserType): UserViewModel => {
    return {
        id: dbEntity.id,
        userName: dbEntity.userName
    }
}

export const getUsersRouter = (db: DBType) => {

    const router = express.Router()

    router.get('/', (req: RequestWithQuery<QueryUserModel>, res: Response<UserViewModel[]>) => {
        let foundEntities = db.users
        if (req.query.userName) {
            foundEntities = foundEntities.filter((u) => u.userName.indexOf(req.query.userName as string) > -1)
        }
        res.json(foundEntities.map(mapEntityToViewModel))
    })

    router.get('/:id', (req: RequestWithParams<URIParamsUserIdModel>, res: Response<UserViewModel>) => {

        let foundEntity = db.users.find(u => u.id === +req.params.id);
        if (!foundEntity) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.json(mapEntityToViewModel(foundEntity))
    })

    router.post('/', (req: RequestWithBody<CreateUserModel>, res: Response<UserViewModel>) => {

        if (!req.body.userName) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return
        }

        let createdEntity: UserType = {
            id: +(new Date()),
            userName: req.body.userName,
        };


        db.users.push(createdEntity)


        res.status(HTTP_STATUSES.CREATED_201).json(mapEntityToViewModel(createdEntity))
    })

    router.delete('/:id', (req: RequestWithParams<URIParamsUserIdModel>, res) => {
        db.users = db.users.filter(u => u.id !== +req.params.id);
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

    router.put('/:id', (req: RequestWithParamsAndBody<{
            id: string
        }, UpdateUserModel>, res: Response<UserType>) => {
            if (!req.body.userName) {
                res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
                return
            }
            let foundEntity = db.users.find(u => u.id === +req.params.id);
            if (!foundEntity) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }
            foundEntity.userName = req.body.userName
            res.sendStatus(204).json(foundEntity)
        }
    )

    return router


}