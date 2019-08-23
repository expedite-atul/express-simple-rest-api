const express = require('express');
const Joi = require('joi');

// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.js');
//  const server = express();

/**
 * middleware basics
 */
// server.use(express.json());

// server.use((err,req,res,next)=>console.err('error found',err));
const server = express();

/**
 * joi schema 
 */
function validateName(update,){
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(update,schema);
}

/**
 * middleware basics
 */
server.use(express.json());

const address = [
    { id: 1, name: "atul1", address: "test1", mobile: 1234567890 },
    { id: 2, name: "atul2", address: "test2", mobile: 234567890 },
    { id: 3, name: "atul3", address: "test3", mobile: 34567890 },
    { id: 4, name: "atul4", address: "test4", mobile: 4567890 },
    { id: 5, name: "atul4", address: "test4", mobile: 456789 }
]

const port = process.env.PORT || 3000;

/**
 * get all addresses
 */
server.get('/address', (req, res) => {
    res.status(200).send(address);
});

/**
 * get addresses by Id
 */
// next ?? error handling 
server.get('/address/:id', (req, res) => {
    const matchedAdd = address.find(c => c.id === parseInt(req.params.id));
    try {
        if (!matchedAdd) {
            res.status(400).send({ "statusCode": 400, "message": "dataNotFound" });
        }
        res.send({ "statusCode": 200, "message": "data found", "data": matchedAdd });
    } catch (error) {
        console.log(error);
        throw error;
    }
});

/**
 * post address only if mobile number is distinct
 */
server.post('/address', (req, res) => {
let {mobile} = req.body;
let numberFound = false;
for (let index = 0; index < address.length; index++) {
    if (address[index].mobile === mobile) {
        numberFound = true;
        break;
    }
}if (numberFound) {
    res.status(400).send({ "statusCode": 400, "message": "mobile number already exists"});
}else{
    const add = {
    id: address.length + 1,
    // ...req.body // to do learning
    name:req.body.name,
    address:req.body.address,
    mobile:req.body.mobile
    }
address.push(add);
res.status(200).send({ "statusCode": 200, "message": "success","data":add});
}  
});

/**
 * update address fields by id
 */
server.put('/address/:id',(req,res)=>{
    const update = address.find(c => c.id === parseInt(req.params.id));
    if(!update) return res.status(400).send({"statusCode":400,"message":"id not available"});
    const {error} = validateName(req.body);
    if (error) {
        res.status(400).send({"status":400,"message":error.details[0].message});
        return;
    }
    update.name = req.body.name;
    update.address = req.body.address;
    update.mobile = req.body.mobile;
    res.status(200).send({update});
});

/**
 * update name field
 */
server.patch('/address/:id',(req,res)=>{
    const patch = address.find(c => c.id === parseInt(req.params.id));
    if(!patch) return res.status(400).send({"statusCode":400,"message":"id not available"});
    patch.name = req.body.name;
    res.status(200).send({patch});
});

/**
 * delete 
 */
server.delete('/address/:id',(req,res)=>{
    const del = address.find(c => c.id === parseInt(req.params.id));
    if(!del) return res.status(400).send({"statusCode":400,"message":"id not available"});    
    // console.log(del.id);
    address.splice(del.id-1,1)
    res.send(address);
});

/**
 * server listen
 */
server.listen(port, () => console.log(`server running on http://localhost:${port}/`));
