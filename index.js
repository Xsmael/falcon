// server.start();
var log=  require("noogger");
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/falcon');

var faye= require('faye');
var connector = new faye.Client('http://localhost:8888/faye');

// Loading models
var Vehicle=  require('./models/Vehicle');


// Running the connector
var http = require('http');
faye = require('faye');

var PORT=  8888; 
var server = http.createServer(),
bayeux = new faye.NodeAdapter({mount: '/'});

bayeux.on('subscribe', function(clientId, channel) { log.notice(clientId+" subscribed on channel "+channel); });
bayeux.on('unsubscribe', function(clientId, channel) { log.warning(clientId+" unsubscribed on channel "+channel); });
bayeux.on('publish', function(clientId, channel,data) { log.debug(clientId+" publish on channel "+channel); });
bayeux.attach(server);
server.listen(PORT);
log.info("Connector running on Port "+PORT);

//* Done





connector.subscribe('/create/*').withChannel(function(channel, data) {
    if(!data) return;
    log.debug("message received on  "+channel);
    var ch= channel.split('/')[2];

    switch (ch) {
        case "Vehicle":
            Vehicle.create(data, function (err, res) {
                if(err) log.error(err);
                else {
                    Vehicle.find( {}, function (err, docs) {
                        if(err) log.error(err);
                        connector.publish('/list/Vehicle',docs);        
                    }); 
                    log.debug('Vehicle created!');
                } 
            });
            break;
    
        default:
            log.warning('this channel is not handled! : '+ch);
            break;
    }
});

connector.subscribe('/list-req/*').withChannel(function(channel, queryString) {
    if(!queryString) return;
    log.debug("message received on  "+channel);
    var ch= channel.split('/')[2];

    switch (ch) {
        case "Vehicle":
            Vehicle.find(queryString, function (err, docs) {
                if(err) log.error(err);
                connector.publish('/list/Vehicle',docs);        
            }); 
            break;
    
        default:
            log.warning('this channel is not handled! : '+ch);
            break;
    }  
});


connector.subscribe('/UpdateAccReq', function (data) {
    
    if(data) {
        Vehicle.findByIdAndUpdate(); // impl
    }    
});

connector.subscribe('/ListAccReq', function (data) {
    
    log.warning('IN List ack Req '+data);
    
    if(data) {
        Vehicle.find( {}, function (err, users) {
            if(err) log.error(err);
            connector.publish('/ListAcc',users);        
        }); 
    }    
});

connector.subscribe('/DelAccReq', function (data) {

    if(data) {
        Vehicle.findByIdAndRemove(data._id,function (err) {
            if(err) log.error(err);
            else {
                Vehicle.find( {}, function (err, users) {
                    if(err) log.error(err);
                    connector.publish('/ListAcc',users);        
                }); 
            }
        });
    }
});

connector.subscribe('/XlsGenerateJounal', function (boo) {
    generateXlsJournal();
})



function getVehicleStats(clientModel) {
    var logdb= LogLine(clientModel);
    Vehicle.find({collection:clientModel})
    logdb.find({time:{ $gt:'', $lt:''}}, function (err,docs) {
        // fay publish
    });
    
}

function generateXlsJournal() {
    var json2xls = require('json2xls');
    var fs= require('fs');

 Vehicle.find({action:'read'},{},{lean: true}, function (err,docs) {
     if(err)    log.error(err);
     else {
         var xls = json2xls(docs);
         fs.writeFile('/var/www/html/site/down/journal.xlsx', xls, 'binary',function (err) {
             if(err) {
                 log.error(err);
                 connector.publish('/XlsJournalReady',false);
             }
             else
                connector.publish('/XlsJournalReady',"down/journal.xlsx");
         });

     }
 })    
}






