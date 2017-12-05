// server.start();
var log=  require("noogger").init({
	consoleOutput : true,
	outputPath: "logs/",
	fileNamePrefix:"falcon-"
});
var mongoose = require('mongoose');
var fs= require("fs");
var path= require('path');
mongoose.connect('mongodb://127.0.0.1:27017/falcon');

// Running the connector
var faye= require('faye');
var connector = new faye.Client('http://localhost:8888/faye');
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



function absolutePath(relative) {
    return path.join(__dirname, relative);
}
// Loading models

function loadModels() {
    let models= {};
    fs.readdir(absolutePath("models"),function (err,modelFiles) {
        modelFiles.forEach(function (file) {
            let model= path.parse(file).name;
            log.debug('./models/'+model);
            models[model]= require('./models/'+model);
            log.debug("Loading : "+model);
        });
    });
    return models;
}

var  models= loadModels();
 //* Done



connector.subscribe('/create/*').withChannel(function(channel, data) {
    if(!data) return;
    log.debug("message received on  "+channel);
    var modelName= channel.split('/')[2];

    if(models) { 
        let model=  models[modelName];
        model.create(data, function (err, res) {
            if(err) log.error(err); 
            else {
                model.find( {}, function (err, docs) {
                    if(err) log.error(err);
                    connector.publish('/list/'+modelName,docs);        
                }); 
                log.debug( modelName+'created!');
            } 
        });
    }
    else {
        log.warning('this channel is not handled! : '+channel+' with respect to the model:'+modelName+'\nData:');
        log.warning(data);
    }
});

connector.subscribe('/update/*').withChannel(function(channel, data) {

    if(!data) return;
    log.debug("message received on  "+channel);
    var modelName= channel.split('/')[2];

    if(models) { 
        let model=  models[modelName];
        let id= data._id;
         console.log(data);
         delete data._id;
         console.log(data);
        model.findByIdAndUpdate(id,data, function (err, res) {
            if(err) log.error(err); 
            else {
                model.find( {}, function (err, docs) {
                    if(err) log.error(err);
                    connector.publish('/list/'+modelName,docs);        
                }); 
                log.debug( modelName+'updated!');
            } 
        });
    }
    else {
        log.warning('this channel is not handled! : '+channel+' with respect to the model:'+modelName+'\nData:');
        log.warning(data);
    }  
});


connector.subscribe('/delete/*').withChannel(function(channel, data) {
    
    if(!data) return;
    log.debug("message received on  "+channel);
    var modelName= channel.split('/')[2];

    if(models) { 
        let model=  models[modelName];
        model.findByIdAndRemove(data._id, function (err, res) {
            if(err) log.error(err); 
            else {
                model.find( {}, function (err, docs) {
                    if(err) log.error(err);
                    connector.publish('/list/'+modelName,docs);        
                }); 
                log.debug( modelName+' deleted!');
            } 
        });
    }
    else {
        log.warning('this channel is not handled! : '+channel+' with respect to the model:'+modelName+'\nData:');
        log.warning(data);
    }
});

connector.subscribe('/list-req/*').withChannel(function(channel, queryString) {
    if(!queryString) return;
    log.debug("message received on  "+channel);
    var modelName= channel.split('/')[2];
    
    if(1) { 
        let model=  models[modelName];
        model.find(queryString, function (err, docs) {
            if(err) log.error(err);
            connector.publish('/list/'+modelName,docs);        
        }); 
    }
    else {
        log.warning('this channel is not handled! : '+channel+' with respect to the model:'+modelName+'\n queryString:');
        log.warning(queryString);
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






