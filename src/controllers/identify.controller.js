import identifyService from "../services/identify.service.js";

const identify = async (req, res) => {
    try {
        const result = await identifyService.process(req.body);
        return res.status(200).json({ contact: result });
    }

    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export default { identify };