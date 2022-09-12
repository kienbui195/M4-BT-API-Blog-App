"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("./src/data-source");
const Blog_1 = require("./src/entity/Blog");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const port = 8080;
data_source_1.AppDataSource.initialize().then((connection) => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    const upload = (0, multer_1.default)();
    app.use(body_parser_1.default.json());
    const BlogRePo = connection.getRepository(Blog_1.Blog);
    app.set('view engine', 'ejs');
    app.set('views', path_1.default.join(__dirname, 'views'));
    app.get('/create', (req, res) => {
        res.render('WriteBlog');
    });
    app.post('/create', upload.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const blog = new Blog_1.Blog();
        blog.title = req.body.title;
        blog.content = req.body.content;
        yield BlogRePo.save(blog);
        res.redirect('/');
    }));
    app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let data = yield BlogRePo.find();
        res.render('BLog', { data: data });
    }));
    app.get('/notFound', (req, res) => {
        res.render('NotFound');
    });
    app.get('/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let data = yield BlogRePo.findOneBy({ id: +req.query.id });
        res.render('Update', { data: data });
    }));
    app.post('/update', upload.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let data = new Blog_1.Blog();
        data.title = req.body.title;
        data.content = req.body.content;
        yield BlogRePo.update({ id: +req.body.id }, data);
        res.redirect('/');
    }));
    app.get('/delete', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield BlogRePo.delete({ id: +req.query.id });
        res.redirect('/');
    }));
    app.get('/detail', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let data = yield BlogRePo.findOneBy({ id: +req.query.id });
        res.render('detail', { data: data });
    }));
    app.listen(port, () => {
        console.log(`running at http://localhost:${port}`);
    });
}));
//# sourceMappingURL=index.js.map