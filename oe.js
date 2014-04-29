/*global $, document*/

var rpc = require('node-json-rpc');



/*
 * GENERIC FUNCTION FOR JSON/AJAX
 */


function read_partenaire(host, port, db, login, password) {
    "use strict";
    var session_id = '';
    var id = 0;
    var context = '';
    var SID = '';
    var cookies = '';
    var options = {
        // int port of rpc server, default 5080 for http or 5433 for https
        port: port,
        // string domain name or ip of rpc server, default '127.0.0.1'
        host: host,
        // string with default path, default '/'
        path: '/web/session/get_session_info',
        // boolean false to turn rpc checks off, default true
        strict: true
    };
    var client = new rpc.Client(options);
    client.call({"jsonrpc": "2.0", 'id': id, "method": "call", "params": {"context": {}, "session_id": null}}, function (err, res) {
        // Did it all work ?
        if (err) {
            console.log("Erreur get session info " + err);
        }
        else {
            id++;
            session_id = res.result.session_id;
            context = res.result.user_context;
            cookies = res.headers["set-cookie"];
            var params = {
                'db': db,
                'login': login,
                'password': password,
                'session_id': session_id }

            client.call({"jsonrpc": "2.0", 'id': id, "method": "call", "params": params}, function (err, res) {
                session_id = res.result.session_id;
                context = res.result.user_context;
                params = {
                    'context': context,
                    'session_id': session_id,
                    "model": "res.partner",
                    "args": [[['name','like','%']]],
                    'method': 'search',
                    "kwargs": {}


                };

                id++;
                client.call({"jsonrpc": "2.0", 'id': "r"+id, "method": "call", "params": params}, function (err, res) {

                        // Did it all work ?
                        if (err) {
                            console.log(err);
                        }
                        else {
                            var ids = res['result'];
                            params = {
                                'context': context,
                                'session_id': session_id,
                                "model": "res.partner",
                                "args": [ids],
                                'method': 'read',
                                "kwargs": {}


                            };
                            client.call({"jsonrpc": "2.0", 'id': "r"+id, "method": "call", "params": params}, function (err, res) {

                                // Did it all work ?
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    var resultat =res['result']
                                    resultat.forEach(function(value) {
                                        console.log(value)
                                    })
                                    }
                            },{  "path": '/web/dataset/call_kw',   'cookies': cookies});
                        }
                    }
                    , {  "path": '/web/dataset/call_kw',  'cookies': cookies});

            }, {'path': "/web/session/authenticate", 'cookies': cookies})
            console.log('-------------------------------------');
        }
    }, options);

}

read_partenaire('127.0.0.1','8090','oev7','admin','admin');