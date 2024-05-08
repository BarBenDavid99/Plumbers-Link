const { Plumber } = require("../plumber/plumber.model");
const { OpinionValid } = require("./opinion.joi");
const Opinion = require('./opinion.model');


module.exports = app => {

    app.get("/plumbers/:id/opinions", async (req, res) => {
        try {
            const plumber = await Plumber.findById(req.params.id);
            if (!plumber) {
                return res.status(404).json({ message: "Plumber not found" });
            }

            const opinions = plumber.opinions;

            res.json(opinions);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    app.post("/plumbers/:id/opinions", async (req, res) => {
        try {
            const { error } = OpinionValid.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const { customerName, rating, comment } = req.body;

            const opinion = new Opinion({
                customerName,
                rating,
                comment,
            });

            await opinion.save();

            const plumber = await Plumber.findById(req.params.id);
            if (!plumber) {
                return res.status(404).json({ message: "Plumber not found" });
            }

            plumber.opinions.push(opinion);


            const totalRatings = plumber.opinions.reduce((total, opinion) => total + opinion.rating, 0);
            plumber.averageRating = totalRatings / plumber.opinions.length;

            await plumber.save();

            res.status(201).json(plumber);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });



    app.put("/plumbers/:plumberId/opinions/:opinionId", async (req, res) => {
        try {
            const plumber = await Plumber.findById(req.params.plumberId);
            if (!plumber) {
                return res.status(404).json({ message: "Plumber not found" });
            }

            const opinion = plumber.opinions.id(req.params.opinionId);
            if (!opinion) {
                return res.status(404).json({ message: "Opinion not found" });
            }

            const { error } = OpinionValid.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            Object.assign(opinion, req.body);
            await plumber.save();
            res.json(opinion);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    app.delete("/plumbers/:plumberId/opinions/:opinionId", async (req, res) => {
        try {
            const plumber = await Plumber.findById(req.params.plumberId);
            if (!plumber) {
                return res.status(404).json({ message: "Plumber not found" });
            }

            plumber.opinions.id(req.params.opinionId).remove();
            await plumber.save();
            res.json({ message: "Opinion deleted" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });
};
