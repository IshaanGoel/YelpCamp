var express = require("express");
var router = express.Router();
var campground = require("../models/campground");
var middleware = require("../middleware");

router.get("/",function(req,res){
    campground.find({},function(error,allCampgrounds){
       if(error){
           console.log(error);
       } else{
           res.render("campground/index",{campgrounds: allCampgrounds});
       }
    });
});

router.post("/",middleware.isLoggedIn,function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name,image: image,description: desc,author: author};
    campground.create(newCampground, function(error,newlyCreated){
       if(error){
           console.log(error);
       } else{
           res.redirect("/campgrounds");
       }
    });
});

router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campground/new");
});

router.get("/:id",function(req,res){
    campground.findById(req.params.id).populate("comments").exec(function(error,foundCampground){
        if(error){
            console.log(error);
        }else{
            res.render("campground/show",{campground: foundCampground});
        }
    });
});

router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
        campground.findById(req.params.id,function(err,foundCampground){
        res.render("campground/edit",{campground: foundCampground}); 
    });
});

router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
   campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       }else{
           res.redirect("/campgrounds/" + req.params.id);
       }
   }); 
});

router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
   campground.findByIdAndRemove(req.params.id,function(err){
      if(err){
          res.redirect("/campgrounds");
      } else{
          res.redirect("/campgrounds");
      }
   });
});

module.exports = router;