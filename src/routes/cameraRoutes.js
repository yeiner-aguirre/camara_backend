const express = require('express');
const {
    getCameras,
    createCamera,
    updateCamera,
    deleteCamera,
} = require('../controllers/cameraController');

const router = express.Router();

router.get('/', getCameras);
router.post('/', createCamera);
router.put('/:id', updateCamera);
router.delete('/:id', deleteCamera);

module.exports = router;
