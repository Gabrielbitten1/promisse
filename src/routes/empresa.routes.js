'use strict';

const { Router } = require('express');
const EmpresaController = require('../controllers/empresa.controller');
const { authorize } = require('../middlewares/auth.middleware');

const router = Router();

router.get('/',       authorize('SUPER_ADMIN'), EmpresaController.list);
router.get('/:id',    EmpresaController.findById);
router.post('/',      authorize('SUPER_ADMIN'), EmpresaController.create);
router.put('/:id',    authorize('SUPER_ADMIN','ADMIN_EMPRESA'), EmpresaController.update);
router.delete('/:id', authorize('SUPER_ADMIN'), EmpresaController.remove);

module.exports = router;
