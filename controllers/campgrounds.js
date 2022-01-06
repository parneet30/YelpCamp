const Campground = require('../models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const {cloudinary}=require('../cloudinary');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    const geoData=await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f=>({url: f.path, filename: f.filename}));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const campground=await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f=>({url: f.path, filename: f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: {filename: { $in: req.body.deleteImages }}}});
    }
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    
    await Campground.findByIdAndDelete(id); // this will call findOneAndDelete hookup (by default) , present in campgrounds model , we could have used direct delete like deleting review but ........ Basically, it can be more practical to use mongoose hooks (like the pre/post hook) in the scenario where we know we will always want to remove all the campground reviews when we delete a specific campground.

    //Basically, we can just abstract that logic in the model code and have it organized and managed separately. This would allow us to keep our routes/controllers code lighter and more concise. If the post hook code was even longer, it would be even more noticeable, or if we had an option to delete campgrounds from different routes/parts of our application then we wouldn't have to rewrite the code, we know that the hook will run post deletion and clear up and remaining reviews that were associated with the campground.

    //So, we could code it in the route directly, but it can be more practical to use mongoose hooks to better manage and organize the code!     
    // other way: 
    // const deletedCampground = await Campground.findByIdAndDelete(id);
    // await Review.deleteMany({ _id: { $in: deletedCampground.reviews } }) // this line is in hookup
    req.flash('success', 'Campground deleted');
    res.redirect('/campgrounds');
}