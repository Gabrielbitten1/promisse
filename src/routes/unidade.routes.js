'use strict';

const { Router } = require('express');
const UnidadeController = require('../controllers/unidade.controller');
const { authorize } = require('../middlewares/auth.middleware');

const router = Router();

router.get('/',       UnidadeController.list);
router.get('/:id',    UnidadeController.findById);
router.post('/',      authorize('SUPER_ADMIN','ADMIN_EMPRESA'), UnidadeController.create);
router.put('/:id',    authorize('SUPER_ADMIN','ADMIN_EMPRESA'), UnidadeController.update);
router.delete('/:id', authorize('SUPER_ADMIN','ADMIN_EMPRESA'), UnidadeController.remove);

module.exports = router;
