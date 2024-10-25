const app = require("./index");
const port = 8080;

app.listen(port, (err) => {
    if (err) {
        console.log("SERVER ON")
    } else {
        console.log("SERVER OFF")
    }
})