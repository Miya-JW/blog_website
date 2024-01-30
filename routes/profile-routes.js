const express = require('express');
const router = express.Router();
const userDao = require("../modules/users-dao");
const {locals} = require("express/lib/application");

router.use(function (req, res, next) {
    res.locals.user = req.session.user;
    next();
});


router.get("/profile", async function (req, res) {
     // res.render("profile");
    if (req.session.user) {
        res.render("profile");
    } else {
        res.redirect("./login?message=Please log in to peek at your profile.");
    }

});

router.post('/update-profile', async function (req, res)  {
    const { field, value } = req.body;
    if (field=='userName'){
        const exist=await userDao.checkUserExists(field);
        if (!exist){
            await updateUserProfile();
        }else {
            res.status(409).json({ message: 'Username already exists' });
        }
    }else if (field=='real_name'||field=='avatar'||field=='description'){
        await updateUserProfile();
    }
    // 根据字段更新用户资料
    // 这里需要验证用户身份和安全性检查
async function updateUserProfile(){
    try {
        const newUser= await userDao.updateUserProfile(req.session.user.user_id, field, value);
        req.session.user=newUser;
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

});




module.exports = router;