"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cors_1 = require("cors");
const properties_1 = require("./routes/properties");
const amenities_1 = require("./routes/amenities");
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/properties', properties_1.propertyRouter);
app.use('/api/amenities', amenities_1.amenityRouter);
// Basic health check endpoint
app.get('/', (req, res) => {
    res.send('Server is running');
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map