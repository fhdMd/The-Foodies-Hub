// Start server and connect to database
mongoose.connect('mongodb://localhost:27017/TheFoodiesHub')
    .then(() => {
        console.log("Connected to Database");
        app.listen(8080, () => {
            console.log('Server running on port 8080');
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err); // Log connection error
    });