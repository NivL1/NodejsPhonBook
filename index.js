import express from 'express';
import bodyParser from 'body-parser';
import contactsRoutes from './routes/contacts.js';
// import Contact from './models/contacts.js';
// import Address from './models/address.js';
// import sequelize from "./connection/seq/sequelize.js";

// Contact.hasMany(Address);

// sequelize
//     .sync({force: true})
//     .then((result) => {
//         console.log(result);
//     })
//     .catch((err) => {
//         console.log(err)
//     });

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use('/api/website/1.0/contacts', contactsRoutes);

app.get('/', (req, res) => res.send("{'status':'healthy'}"));

app.listen(PORT, () => console.log(`Server Running on port: http://localhost:${PORT}`));
