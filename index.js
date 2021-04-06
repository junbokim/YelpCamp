const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const CampGround = require('./models/campground');
const methodOverride = require('method-override');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", ()=>{
    console.log("Database Connected");
})

app.listen(3000,()=>{
    console.log('Serving on port 3000');
})

app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/',(req,res)=>{
    res.render('index')
})

app.get('/campgrounds', async (req,res)=>{
    const campgrounds = await CampGround.find({});
    res.render('campgrounds/index', {campgrounds});
})

app.get('/campgrounds/:id/edit', async (req,res)=>{
    const {id} = req.params
    const campground = await CampGround.findById(id);
    res.render('campgrounds/edit', {campground})
})

app.get('/campgrounds/new', (req,res)=>{
    res.render('campgrounds/new')
})

app.put('/campgrounds/:id', async (req,res)=>{
    const {id} = req.params;
    const campground =  await CampGround.findByIdAndUpdate(id, req.body, {runValidators: true, new:true});
    res.redirect(`/campgrounds/${id}`);
})

app.post('/campgrounds', (req,res) =>{
    console.log(req.body.title);
    const c = new CampGround(req.body);
    console.log(c.title);
    c.save();
    res.redirect('/campgrounds')
})

app.get('/campgrounds/:id', async(req,res) =>{
    const {id} = req.params;
    const campgroundResult = await CampGround.findById(id);
    res.render('campgrounds/show', {campgroundResult})
})
