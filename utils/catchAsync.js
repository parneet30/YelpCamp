module.exports=func=>{
    return (req,res, next)=>{
        func(req,res, next).catch(next);
    }
} // returns a function that has func executed and then catches any errors and passes them to next