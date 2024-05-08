const { PlumberValid } = require("./plumber.joi");
const guard = require("../../guard");
const { Plumber } = require("./plumber.model");

module.exports = app => {

    app.get("/plumbers", async (req, res) => {
        try {
            let query = {};

            if (req.query.serviceArea) {
                query.serviceArea = req.query.serviceArea;
            }

            const plumbers = await Plumber.find(query)
                .exec();
            if (req.query.sortBy === "opinionsLength") {
                plumbers.sort((a, b) => b.opinionsLength - a.opinionsLength);
            } else if (req.query.sortBy === "averageRating") {
                plumbers.sort((a, b) => b.averageRating - a.averageRating);
            }

            res.json(plumbers);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });


    app.get("/plumbers/:id", async (req, res) => {
        try {
            const plumber = await Plumber.findById(req.params.id);
            if (!plumber) {
                return res.status(404).json({ message: "Plumber not found" });
            }
            res.json(plumber);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    app.post('/plumbers', guard, async (req, res) => {
        const { name, bizName, profession, description, phone, email, image, address, serviceArea, bizNumber } = req.body;

        const validate = PlumberValid.validate(req.body, { abortEarly: false });

        if (validate.error) {
            const errors = validate.error.details.map(err => err.message);
            return res.status(403).send(errors);
        }
        const plumber = new Plumber({
            name,
            bizName,
            profession,
            description,
            phone,
            email,
            image,
            address,
            serviceArea,
            bizNumber,
        });
        try {
            const newPlumber = await plumber.save();
            res.status(201).json(newPlumber);
        } catch (err) {
            res.status(400).json({ message: err.message });
        };
    });


    app.put("/plumbers/:id", guard, async (req, res) => {
        try {
            const { error } = PlumberValid.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const plumber = await Plumber.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!plumber) {
                return res.status(404).json({ message: "Plumber not found" });
            }
            res.json(plumber);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });



    app.delete("/plumbers/:id", guard, async (req, res) => {
        try {
            const plumber = await Plumber.findByIdAndDelete(req.params.id);
            if (!plumber) {
                return res.status(404).json({ message: "Plumber not found" });
            }
            res.json({ message: "Plumber deleted" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

};
