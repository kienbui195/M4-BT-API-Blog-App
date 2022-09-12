import { AppDataSource } from "./src/data-source";
import { Blog } from "./src/entity/Blog";
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import multer from "multer";

const port = 8080;

AppDataSource.initialize().then(async connection => {
    const app = express();
    const upload = multer();
    app.use(bodyParser.json());
    const BlogRePo = connection.getRepository(Blog);
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));

    app.get('/create', (req, res) => {
        res.render('WriteBlog');
    })

    app.post('/create', upload.none(), async (req, res) => {
        const blog = new Blog();
        blog.title = req.body.title;
        blog.content = req.body.content;
        await BlogRePo.save(blog);
        res.redirect('/');
    })

    app.get('/', async (req, res) => {
        let data = await BlogRePo.find();
        res.render('BLog', { data: data });
       
    })

    app.get('/notFound', (req, res) => {
        res.render('NotFound');
    })

    app.get('/update', async (req, res) => {
        let data = await BlogRePo.findOneBy({ id: +req.query.id });
        res.render('Update', { data: data });
    })

    app.post('/update', upload.none(), async (req, res) => {
        let data = new Blog();
        data.title = req.body.title;
        data.content = req.body.content;
        await BlogRePo.update({ id: +req.body.id }, data)
        res.redirect('/');
    })

    app.get('/delete', async (req, res) => {
        await BlogRePo.delete({ id: +req.query.id });
        res.redirect('/');
    })

    app.get('/detail', async (req, res) => {
        let data = await BlogRePo.findOneBy({ id: +req.query.id });
        res.render('detail', { data: data })
    })

    app.listen(port, () => {
        console.log(`running at http://localhost:${port}`);
        
    });
})