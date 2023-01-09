import User from "../models/User";
import bcrypt from 'bcrypt';
export const getJoin = (req, res) => {
    return res.render("join", { pageTitle: "join User" })
};
export const postJoin = async (req, res) => {
    const { body: { email, username, password, password2, name, location } } = req;
    const pageTitle = "Join";
    if (password !== password2) {
        return res.status(400).render("join", { pageTitle, errorMessage: "Password Confirmation does not match" });
    }
    const exists = await User.exists({ $or: [{ username }, { email }] });
    if (exists) {
        return res.status(400).render("join", { pageTitle, errorMessage: "This username/email is already taken." });
    }
    await User.create({
        email, username, password, name, location
    });
    return res.redirect("/");
};

export const getLogin = (req, res) => res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
    const { body: { username, password } } = req;
    const pageTitle = "Login";
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).render("login", { pageTitle, errorMessage: "An account with this username does not exists." });
    }
    // 클라이언트 입력 password, db password 비교 (true,false)
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return res.status(400).render("login", { pageTitle, errorMessage: "Wrong Password" });
    }

    req.session.loggedIn = true;
    req.session.user = user;

    return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
    const baseURL = 'https://github.com/login/oauth/authorize';
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: 'read:user user:email',
    };
    const params = new URLSearchParams(config).toString();
    const finalURL = `${baseURL}?${params}`;
    return res.redirect(finalURL);
};

export const finishGithubLogin = async (req, res) => {
    const baseURL = 'https://github.com/login/oauth/access_token';
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalURL = `${baseURL}?${params}`;
    const data = await fetch(finalURL, {
        method: "POST",
        headers: {
            Accept: "application/json",
        },
    });
    const json = await data.json();
    console.log(json);
};

export const logout = (req, res) => res.send("logout");
