const router = require('express').Router();


router.get('/', (req,res) =>{
    return res.status(200).json(
        {
            "code": 200,
            "message": "Default api access point."
        }
    );
});


module.exports = router;