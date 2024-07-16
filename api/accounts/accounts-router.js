const router = require('express').Router()
const mdw = require('./accounts-middleware')

const Accounts = require('./accounts-model')

router.get('/', (req, res, next) => {
// Code here
  Accounts.getAll()
    .then(user => {
      res.json(user)
    })
    .catch(next)
})

router.get('/:id', mdw.checkAccountId, (req, res) => {
  res.json(req.account)
})

router.post('/', mdw.checkAccountPayload, mdw.checkAccountNameUnique, (req, res, next) => {
  Accounts.create(req.body)
    .then(account => {
      res.status(201).json(account)
    })
    .catch(next)
})

router.put('/:id', mdw.checkAccountId, mdw.checkAccountNameUnique, mdw.checkAccountPayload, (req, res, next) => {
  Accounts.updateById(req.params.id, req.body)
    .then(account => {
      res.status(200).json(account)
    })
    .catch(next)
});

router.delete('/:id', mdw.checkAccountId, (req, res, next) => {
  Accounts.deleteById(req.params.id)
    .then(() => {
      res.status(200).json(req.account)
    })
    .catch(next)
})

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: 'Something wrong inside routers',
    err: err.message,
    stack: err.stack,
  })
})

module.exports = router;
