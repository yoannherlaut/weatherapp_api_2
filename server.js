var express  = require('express');
var request  = require('request');
var mongoose = require('mongoose');

var options = { server: { socketOptions: {connectTimeoutMS: 30000 } }};
mongoose.connect('mongodb://noel:keepcool@ds041563.mlab.com:41563/weatherapp',options, function(err) {
  console.log(err);
});

var citySchema = mongoose.Schema({
    name: String,
    icon: String,
    description: String,
    temp_max: Number,
    temp_min: Number,
    sort: Number
});
var CityModel = mongoose.model('city', citySchema);

var app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');

var cityList = [];
CityModel.find(null, null, {sort: {sort: 1}},function (err, cities) {
  cityList = cities;
})

app.get('/', function (req, res) {
  res.render('index', {cityList : cityList});
});

app.get('/updatesort', function (req, res) {
  var sort = JSON.parse(req.query.sort);
  var cityListTmp = [];
  for(var i=0; i<sort.length; i++) {
    var position = sort[i];
    console.log(cityList[position].name);
    cityListTmp.push(cityList[position]);
    CityModel.update({ _id: cityList[position].id}, { sort: i }, function(error, raw) {
    });
  }
  cityList = cityListTmp;
  res.render('index', {cityList : cityList});
});

app.get('/add', function (req, res) {
    request("http://api.openweathermap.org/data/2.5/weather?q="+req.query.city+"&APPID=9b754f1f40051783e4f72c176953866e&units=metric&lang=fr", function(error, response, body) {
      body = JSON.parse(body);
      var city = new CityModel({
        name: body.name,
        icon: body.weather[0].icon,
        description: body.weather[0].description,
        temp_max: body.main.temp_max,
        temp_min: body.main.temp_min,
        sort : cityList[cityList.length-1].sort+1
      });
      city.save(function (error, city) {
        cityList.push(city);
        res.render('index', {cityList : cityList});
      });
     
    });
    
});

app.get('/delete', function (req, res) {
  CityModel.remove({ _id: req.query.id}, function(error) {
    CityModel.find(null, null, {sort: {sort: 1}}, function (err, cities) {
      cityList = cities;
      res.render('index', {cityList : cityList});
    })
  }); 
});

app.listen(80, function () {
  console.log("Server listening on port 80");
});