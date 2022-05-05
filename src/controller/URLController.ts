import { URL, URLModel } from "../database/model/URL";
import { Request, Response } from "express";
import shortId from 'shortid';
import { config } from "../config/Constant";

export class URLController{
    public async shorten(req: Request, res: Response): Promise<void>{
        const originURL :string = req.body.originURL
        const url = await URLModel.findOne({originURL})
        if(url){
            res.json(url);
            return
        }
        const hash = shortId.generate();
        const shortURL = `${config.API_URL}/${hash}`
        const newURL = await URLModel.create<Partial<URL>>({
            hash,
            shortURL,
            originURL
        })

        res.json(newURL)
    }

    public async redirect(req: Request, res: Response): Promise<void>{
        const {hash} = req.params
        const url = await URLModel.findOne({hash})
        if(url){
            res.redirect(url.originURL);
            return
        }

        res.status(400).json({error: 'url not found'})
        
    }
}