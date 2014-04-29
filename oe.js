/*global $, document*/

var rpc = require('node-json-rpc');



/*
 * GENERIC FUNCTION FOR JSON/AJAX
 */


function read_partenaire(host, port, db, login, password) {
    "use strict";

    var id = 0;



    var options = {
        // int port of rpc server, default 5080 for http or 5433 for https
        port: port,
        // string domain name or ip of rpc server, default '127.0.0.1'
        host: host,
        // string with default path, default '/'
        path: '/jsonrpc',
        // boolean false to turn rpc checks off, default true
        strict: true
    };
    var args = [db, login, password];


    var client = new rpc.Client(options);
    client.call({"jsonrpc": "2.0", 'id': id, "method": "call", "params": {"service":'common','method':'login','args':args}}, function (err, res) {

        if (err) {
            console.log("Login Error " + err);
        }
        else {
            var uid = res['result'];

            args = [db, uid, password,'res.partner','search',[['name','like','%']]];
            client.call({"jsonrpc": "2.0", 'id': id, "method": "call", "params": {"service":'object','method':'execute','args':args}}, function (err, res) {
                if (err) {
                    console.log("Search Error " + err);
                }
                else {
                    var ids = res['result'];
                    args = [db, uid, password,'res.partner','read',ids];
                    client.call({"jsonrpc": "2.0", 'id': id, "method": "call", "params": {"service":'object','method':'execute','args':args}}, function (err, res) {
                        if (err) {
                            console.log("Search Error " + err);
                        }
                        else {
                            console.log(res['result']);

                        }
                    })
                }
            })
        }


    });

}

read_partenaire('127.0.0.1','8090','oev8','admin','admin');