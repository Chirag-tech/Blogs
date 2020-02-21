// require packages
var express = require("express"),
bodyParser = require("body-parser"),
mongoose = require("mongoose");
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer"),
app = express();
//app config
mongoose.connect("mongodb://localhost:27017/blogs",{useNewUrlParser: true});
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
//mongoose schema and model setup
var blogSchema = new mongoose.Schema({
     title:String,
     image:String,
     body:String,
     created:{type: Date, default:Date.now}
});
var Blogsdata = mongoose.model("Blogsdata",blogSchema);
//RESTful_routes
//index route
app.get("/",function(req, res){
    res.redirect("/blogs");
})
//create route
app.get("/blogs",function(req, res){
    
    Blogsdata.find({},function(err, newblogs){
        if(err){
            console.log(err);
        }
        else{
            res.render("index",{data:newblogs});
        }
    });
});
// new route
app.get("/blogs/new",function(req, res){
    res.render("new");
});
app.post("/blogs",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blogsdata.create(req.body.blog,function(err, newblogs){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs");
        }
    });
});
//show route
app.get("/blogs/:id",function(req ,res){
    Blogsdata.findById(req.params.id,function(err, foundblog){
        if(err){
            res.redirect("/");
        }else{
            res.render("show",{blog:foundblog});
        }
    });
});
//edit route
app.get("/blogs/:id/edit",function(req, res){
    Blogsdata.findById(req.params.id,function(err, foundblog){
        if(err){
            res.redirect("/");
        }else{
            res.render("edit",{blog:foundblog});
        }
    });
});
//update route
app.put("/blogs/:id",function(req,res){
    req.body.blog.body = sanitize(req.body.blog.body);
    Blogsdata.findByIdAndUpdate(req.params.id,req.body.blog,function(err, updatedBlog){
        if(err){
            res.redirect("/");
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});
//delete route
app.delete("/blogs/:id",function(req, res){
    Blogsdata.findByIdAndDelete(req.params.id,function(err, deleteblog){
        if(err){
            res.redirect("/");
        }
        else{
            res.redirect("/");
        }
    });
});
//setting up server
var port = process.env.PORT || 5310;
app.listen(port,function(){
    console.log("server has started..");
});
