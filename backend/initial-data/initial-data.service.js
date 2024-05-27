const { Plumber } = require('../handlers/plumber/plumber.model');
const bcrypt = require('bcrypt');
const Opinion = require('../handlers/opinions/opinion.model');
const { Admin } = require('../handlers/admin/admin.model');
const { plumbers, opinions, admins } = require('./initial-data.json');

const initialDataStart = async () => {
    const plumberAmount = await Plumber.countDocuments();
    const adminAmount = await Admin.countDocuments();

    if (!plumberAmount) {

        const plumberIds = [];
        for (const p of plumbers) {
            const plumber = new Plumber(p);
            const obj = await plumber.save();
            plumberIds.push(obj._id);
        }


        const opinionsPerPlumber = opinions.length / plumbers.length;


        for (const plumberId of plumberIds) {
            const plumber = await Plumber.findById(plumberId);
            if (plumber) {
                const plumberOpinions = opinions.splice(0, 2);
                for (const opinionData of plumberOpinions) {
                    const opinion = new Opinion({
                        ...opinionData,
                        plumber_id: plumberId
                    });
                    await opinion.save();
                    plumber.opinions.push(opinion);
                }
                await plumber.save();
            }
        }

        for (const plumberId of plumberIds) {
            const plumber = await Plumber.findById(plumberId);
            if (plumber) {
                const totalRatings = plumber.opinions.reduce((total, opinion) => total + opinion.rating, 0);
                plumber.averageRating = totalRatings / plumber.opinions.length;
                await plumber.save();
            }
        }
    }
    if (!adminAmount) {
        for (const a of admins) {
            const hashedPassword = await bcrypt.hash(a.password, 10);
            const admin = new Admin({ ...a, password: hashedPassword });
            await admin.save();
        }
    }
};

module.exports = initialDataStart;

