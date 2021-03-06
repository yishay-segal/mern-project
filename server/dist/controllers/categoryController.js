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
exports.getSubs = exports.remove = exports.update = exports.read = exports.list = exports.create = void 0;
const categoryModel_1 = __importDefault(require("../models/categoryModel"));
const productModel_1 = __importDefault(require("../models/productModel"));
const subModel_1 = __importDefault(require("../models/subModel"));
const slugify_1 = __importDefault(require("slugify"));
exports.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const category = yield new categoryModel_1.default({
            name,
            slug: slugify_1.default(name).toLocaleLowerCase(),
        }).save();
        res.json(category);
    }
    catch (error) {
        res.status(400).send('Create category failed');
    }
});
exports.list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield categoryModel_1.default.find({}).sort({ createdAt: -1 }).exec());
});
exports.read = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let category = (yield categoryModel_1.default.findOne({
        slug: req.params.slug,
    }).exec());
    const products = yield productModel_1.default.find({ category }).populate('category').exec();
    res.json({
        category,
        products,
    });
});
exports.update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    try {
        const updated = yield categoryModel_1.default.findOneAndUpdate({ slug: req.params.slug }, { name, slug: slugify_1.default(name) }, { new: true });
        res.json(updated);
    }
    catch (error) {
        res.status(400).send('Update failed');
    }
});
exports.remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield categoryModel_1.default.findOneAndDelete({ slug: req.params.slug });
        res.json({
            data: deleted,
            message: 'category deleted',
        });
    }
    catch (error) {
        res.status(400).send('Delete failed');
    }
});
exports.getSubs = (req, res) => {
    subModel_1.default.find({ parent: req.params._id }).exec((err, subs) => {
        if (err)
            console.log(err);
        res.json(subs);
    });
};
