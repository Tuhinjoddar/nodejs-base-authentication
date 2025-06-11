
// Home route
export const home = async (req, res) => {
    try {
        res.json({ message: "Welcome to the API!" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
