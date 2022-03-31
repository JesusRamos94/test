const http = require('http');
const fs = require('fs');
const { roommates, guardarRoommates } = require('./roommates');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const url = require('url')

http
    .createServer((req, res) => {
        let gastosJSON = JSON.parse(fs.readFileSync('gastos.json', 'utf8'));
        let lista_gastos = gastosJSON.gastos;
        // console.log(lista_gastos)

        if (req.url == '/' && req.method == 'GET') {
            res.setHeader('content-type', 'text-html');
            res.end(fs.readFileSync('index.html', 'utf8'));
        };

        if (req.url.startsWith('/roommate') && req.method == 'POST') {
            roommates().then(async (roomie) => {
                guardarRoommates(roomie)
                res.end(JSON.stringify(roomie))
            }).catch(e => {
                res.end()
                console.log('Error en el registro', e)
            });
        };

        if (req.url.startsWith('/roommates') && req.method == 'GET') {
            res.setHeader('content-type', 'application/json');
            res.end(fs.readFileSync('roommates.json', 'utf8'));
        };

        if(req.url.startsWith('/gastos') && req.method == 'GET'){
            res.setHeader('content-type', 'application/json');
            res.end(fs.readFileSync('gastos.json','utf8'));
        }

        if(req.url.startsWith('/gasto') && req.method == 'POST'){
            let body;
            req.on('data', (payload)=> {
                body = JSON.parse(payload)
            });

            req.on('end', () => {
                const gastosJSON = JSON.parse(fs.readFileSync('gastos.json','utf8'));

                let gastos = {
                    roommate: body.roommate,
                    descripcion: body.descripcion,
                    monto: body.monto,
                    fecha: moment().format("lll"),
                    id : uuidv4().slice(0,6)
                }

               const pablo = fs.readFileSync('roomates.json', 'utf8');
               console.log(pablo);

                gastosJSON.gastos.push(gastos);
                fs.writeFileSync('gastos.json', JSON.stringify(gastosJSON));
                res.end();
            })
        }

        if(req.url.startsWith("/gasto") && req.method == 'PUT'){

        const { id } = url.parse(req.url, true).query;

  
            let body;
            req.on('data', (payload) => {
                body =JSON.parse(payload);
                // console.log(body);
            });
            
            req.on('end', () => {
                gastosJSON.gastos = lista_gastos.map((g) => {

                    if(g.id == id){
                        
                        let gastos  = {
                            roommate : body.roommate,
                            descripcion: body.descripcion,
                            monto: body.monto,
                            fecha: moment().format('lll'),
                            id: g.id
                        };

                        return gastos
                    };
                    return g;
                });

                fs.writeFileSync('gastos.json', JSON.stringify(gastosJSON));
                res.end();
            });
    };


        if(req.url.startsWith("/gasto") && req.method == 'DELETE'){
            const { id } = url.parse(req.url, true).query;

            gastosJSON.gastos = lista_gastos.filter((g) => g.id !== id);
            
    
            fs.writeFileSync('gastos.json', JSON.stringify(gastosJSON));
            res.end();
        };


    }).listen(3000, console.log('Escuchando al servidor 3000'));