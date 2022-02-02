const express = require('express');
const viewController= require('../controllers/viewController');
const app = express();

const router = express.Router();

router.get('/' , (req,res) => {
    res.status(200).render('base');
});

router.get('/overview' , viewController.getOverview);

router.get('/tour' , viewController.getTour);

module.exports = router;