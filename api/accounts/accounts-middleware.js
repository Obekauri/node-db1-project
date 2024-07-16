const Accounts = require('./accounts-model')
const db = require('../../data/db-config');

exports.checkAccountPayload = (req, res, next) => {
  const { name, budget } = req.body
  if(name === undefined || budget === undefined){
    res.status(400).json({
      message: "name and budget are required"
    })
  }else if(!name || typeof name != 'string' || (name.trim().length < 3 || name.trim().length > 100)){
    res.status(400).json({
      message: "name of account must be between 3 and 100"
    })
  }else if(isNaN(budget) || typeof budget !== 'number'){
    res.status(400).json({
      message: "budget of account must be a number"
    })
  }else if(budget < 0 || budget > 1000000){
    res.status(400).json({
      message: "budget of account is too large or too small"
    })
  }else{
    req.name = name
    req.budget = budget
    next()
  }
  
}

exports.checkAccountNameUnique = async (req, res, next) => {
  try{
    const nameForCheck = req.body.name.trim()
    const checkUniqName = await db('accounts')
      .where('name',nameForCheck)
      .first();
    if(checkUniqName == undefined){
      req.body.name = nameForCheck
      next()
    }else{
      res.status(400).json({
        message: "that name is taken"
      })
    }
  }catch(err){
    res.status(400).json({
      message: "name and budget are required",
      err: err.message,
      stack: err.stack
    })
  }
}

exports.checkAccountId = async (req, res, next) => {
  try{
    const checkId = await Accounts.getById(req.params.id)
    if(!checkId){
      res.status(404).json({
        message: "account not found"
      })
    }else{
      req.account = checkId
      next()
    }
  }catch(error){
    res.status(500).json({
      message: 'Something went wrong',
      error: error.message,
      stack: error.stack
    })
  }
}
