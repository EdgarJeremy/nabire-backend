/**
 * Public routes
 */
import bcrypt from "bcrypt";
import { requiredPost } from "../middlewares/validator/request_fields";
import { a } from "../middlewares/wrapper/request_wrapper";

function route(app, models, socketListener) {
    let router = app.get("express").Router();

    /**
     * Router disini..
     */
    router.post("/login", requiredPost(["username", "password"]), a(async (req, res) => {
        const body = req.body;
        const user = await models.User.findOne({
            include: [{ model: models.Token }],
            where: { username: body.username },
        });
        if (user) {
            if (bcrypt.compareSync(body.password, user.password)) {
                /** Invalidate old tokens */
                req.invalidateAllToken(user);
                delete user.dataValues.tokens;
                delete user.password;
                delete user.dataValues.password;
                /** Generate new tokens */
                const userToken = await req.generateUserToken(user.id);
                let firstLogin = true;
                if (user.last_login) {
                    firstLogin = false;
                }
                user.update({ last_login: new Date() });
                res.setStatus(res.OK);
                res.setData({
                    user,
                    token: userToken.token,
                    refreshToken: userToken.refreshToken,
                    firstLogin
                });
                res.go();
            } else {
                res.setStatus(res.GAGAL);
                res.setMessage("Username / Password salah");
                res.go();
            }
        } else {
            res.setStatus(res.GAGAL);
            res.setMessage("Username / Password salah");
            res.go();
        }
    }));

    router.get("/check", (req, res) => {
        res.setStatus(req.user ? res.OK : res.GAGAL);
        res.setData(req.user);
        res.setMessage("Session habis");
        res.go();
    });

    router.get("/logout", (req, res) => {
        if (req.user)
            req.invalidateAllToken(req.user);
        res.set("Access-Control-Expose-Headers", "x-access-token, x-refresh-token");
        res.set("x-access-token", "");
        res.set("x-refresh-token", "");
        res.setStatus(res.OK);
        res.setData("Berhasil logout");
        res.go();
    });

    return router;
}

module.exports = route;
