import { Request, Response } from "express";
import { Model } from "mongoose";
import bcrypt from 'bcrypt';

export class BaseController<ModelType>{

    model: Model<ModelType>
    constructor(model: Model<ModelType>) {
        this.model = model;
    }

    async updateById(req: Request, res: Response) {
        try {
            if (req.body["password"]){
                const salt = await bcrypt.genSalt(10);
                const encryptedPassword = await bcrypt.hash(req.body["password"], salt);
                req.body["password"] = encryptedPassword
            }
            const newObject = await this.model.findOneAndUpdate({ _id: req["user"]["_id"]}, req.body, {new: true});
            if (!newObject) {
                return res.status(404).send("Document not found.");
            }
            res.status(200).send(newObject);
        } catch(err) {
            console.log(err.message)
            res.status(406).send("fail: " + err.message);
        }
    }

    async deleteById(req: Request, res: Response) {
        try {
            const object = await this.model.deleteOne({ _id: req["user"]["_id"]});
            res.status(200).send("deleted successfully ");
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

const createController = <ModelType>(model: Model<ModelType>) => {
    return new BaseController<ModelType>(model);
}


export default createController;

    // async get(req: Request, res: Response) {
    //     try {
    //         if (req.query.name) {
    //             const objects = await this.model.find({ name: req.query.name });
    //             res.send(objects);
    //         } else {
    //             const objects = await this.model.find();
    //             res.send(objects);
    //         }
    //     } catch (err) {
    //         res.status(500).json({ message: err.message });
    //     }
    // }

    // async getById(req: Request, res: Response) {
    //     try {
    //         const object = await this.model.findById(req.params.id);
    //         res.send(object);
    //     } catch (err) {
    //         res.status(500).json({ message: err.message });
    //     }
    // }

    // async post(req: Request, res: Response) {
    //     try {
    //         const obj = await this.model.create(req.body);
    //         res.status(201).send(obj);
    //     } catch (err) {
    //         console.log(err);
    //         res.status(406).send("fail: " + err.message);
    //     }
    // }