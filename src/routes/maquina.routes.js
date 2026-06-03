'use strict';

const { Router } = require('express');
const MaquinaController = require('../controllers/maquina.controller');
const validate = require('../middlewares/validate.middleware');
const { authorize } = require('../middlewares/auth.middleware');
const { maquinaSchema } = require('../validators/maquina.validator');

const router = Router();

router.get('/',           MaquinaController.list);
router.get('/:id',        MaquinaController.findById);
router.post('/',          authorize('SUPER_ADMIN','ADMIN_EMPRESA','GESTOR_SEGURANCA'), validate(maquinaSchema), MaquinaController.create);
router.put('/:id',        authorize('SUPER_ADMIN','ADMIN_EMPRESA','GESTOR_SEGURANCA'), validate(maquinaSchema.fork(['tag','descricao','fabricante','modelo','anoFabricacao','unidadeId'], s => s.optional())), MaquinaController.update);
router.delete('/:id',     authorize('SUPER_ADMIN','ADMIN_EMPRESA'), MaquinaController.remove);
router.get('/:id/ncs',    MaquinaController.getNaoConformidades);

module.exports = router;
