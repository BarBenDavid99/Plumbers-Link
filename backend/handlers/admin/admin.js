const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Admin } = require('./admin.model');
const { getLoggedUserId, getTokenParams } = require('../../config');
const { SignupValid, LoginValid, EditUserValid } = require('./admin.joi');
const guard = require("../../guard");

module.exports = app => {

    app.post("/onlyAdmin/signup", guard, async (req, res) => {
        const { name, phone, email, password } = req.body;

        const userId = getLoggedUserId(req, res);
        const user = await Admin.findById(userId);

        if (!user?.isMaster) {
            return res.status(403).send('User not authorized');
        }

        const validate = SignupValid.validate(req.body, { abortEarly: false });

        if (validate.error) {
            const errors = validate.error.details.map(err => err.message);
            return res.status(403).send(errors);
        }

        const admin = new Admin({
            name,
            phone,
            email,
            password: await bcrypt.hash(password, 10),
        })

        const newAdmin = await admin.save();
        res.send(newAdmin);

    })

    app.get('/onlyAdmin/me', guard, async (req, res) => {
        const { userId } = getTokenParams(req, res);
        const admin = await Admin.findById(userId).select("-password");

        if (!admin) {
            return res.status(403).send('User not found');
        }

        res.send(admin);
    });

    app.post('/onlyAdmin/login', async (req, res) => {
        const { email, password } = req.body;

        const validate = LoginValid.validate({ email, password }, { abortEarly: false });

        if (validate.error) {
            const errors = validate.error.details.map(err => err.message);
            return res.status(403).send(errors);
        }

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(403).send("email or password is invalid");
        }

        const passwordMatch = await bcrypt.compare(password, admin.password);

        if (!passwordMatch) {
            return res.status(403).send("email or password is invalid");
        }

        const token = jwt.sign({ userId: admin._id },
            process.env.JWT_SECRET, { expiresIn: '1h' });

        res.send(token);
    });

    app.get("/onlyAdmin", guard, async (req, res) => {
        try {
            const admins = await Admin.find().select('-password');
            res.send(admins);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    app.get("/onlyAdmin/:id", guard, async (req, res) => {
        try {
            const admin = await Admin.findById(req.params.id);
            if (!admin) {
                return res.status(403).json({ message: "Admin not found" });
            }
            res.json(admin);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    app.put('/onlyAdmin/:id', guard, async (req, res) => {
        const userId = getLoggedUserId(req, res);

        if (userId !== req.params.id) {
            return res.status(403).send('User not authorized');
        }

        const { name, phone } = req.body;

        const validate = EditUserValid.validate(req.body, { abortEarly: false });

        if (validate.error) {
            const errors = validate.error.details.map(err => err.message);
            return res.status(403).send(errors);
        }

        const obj = await Admin.findByIdAndUpdate(req.params.id, { name, phone });

        if (!obj) {
            return res.status(403).send("User not found");
        }

        res.send(obj);
    });

    app.delete('/onlyAdmin/:id', async (req, res) => {
        const userId = getLoggedUserId(req, res);
        const admin = await Admin.findById(userId);

        if (userId !== req.params.id && !admin?.isMaster) {
            return res.status(403).send('User not authorized');
        }

        try {
            await Admin.findByIdAndDelete(req.params.id);
        } catch (err) {
            return res.status(403).send("User not found");
        }

        res.json({ message: "Admin deleted" });
    })

}