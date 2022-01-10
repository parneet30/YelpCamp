const mongoose=require('mongoose');
const Review=require('./review');
const Schema=mongoose.Schema;

const ImageSchema=new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
});

const opts = {toJSON: {virtuals: true}}; // so that virtuals also appear in final result schema as they are not included by default

const CampgroundSchema=new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>`;
});

CampgroundSchema.post('findOneAndDelete',async function(doc){ //this hookup will be called post 'findByIdAndDelete'
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews // delete those reviews with id in id's of reviews of doc(to be deleted camp)
            }
        })
    }
});

module.exports=mongoose.model('Campground',CampgroundSchema);