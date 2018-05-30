const router = require('koa-router')();
const controller = require('../../controllers/testController');



router.post('/GetUser', controller.getUser);
router.get('/SiteCheck', controller.siteCheck);

module.exports = router;