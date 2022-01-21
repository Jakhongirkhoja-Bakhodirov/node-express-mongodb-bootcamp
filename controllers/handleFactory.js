const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const ApiFeatures = require('../utils/apiFeatures');

exports.deleteOne = Model => catchAsync(async(req,res,next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
  
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
  
    res.status(204).json({
      status: 'success',
      data: null
    });
});

exports.createOne = Model => catchAsync(async(req,res,next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status:true,
      data : {
          doc
      }
  });
});

exports.updateOne = Model => catchAsync(async(req,res) => {

  const doc = await Model.findByIdAndUpdate(req.params.id,req.body,{
      new:true,
      runValidators:true
  });

  res.status(200).json({
      status:true,
      data:{
        doc
      }
  });
});

exports.getAll = Model => catchAsync(async(req,res,next) => {
  let filter = {};

  if(req.params.tourId)  filter = { tour: req.params.tourId };
  //Execute query
  const features = new ApiFeatures(Model.find(filter) , req.query)
  .filter()
  .sorting()
  .limitFields();
  const doc = await features.query;

  res.status(200).json({
      status:true,
      length:doc.length,
      data:{
          doc
      }
  });
});

exports.getOne = (Model,populateOptions) => catchAsync(async(req,res,next) => {
  
  let query = Model.findById(req.params.id);
  
  if(populateOptions) query = query.populate(populateOptions);

  const doc = await query;
  
  if(!doc) {
      return next(new AppError(`Document not found with following ID ${req.params.id}` , 404));
  }
  res.status(200).json({
      status:true,
      data:{
        doc
      }
  });
});