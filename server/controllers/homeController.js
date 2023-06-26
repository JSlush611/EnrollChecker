export const getHome = async (req, res) => {
    res.render("index");
}

export const getLogin = async (req, res) => {
    res.render("login");
}

export default getHome; getLogin;