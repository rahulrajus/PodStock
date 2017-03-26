var accID = '58d6e8a11756fc834d906ac5'
var money = 20

var request = require('request');

var headers = {
	'Content-Type': 'application/json'
}

var options = {
	url: 'http://api.reimaginebanking.com/accounts/' + accID + '/withdrawals?key=b99f8ab1194bc6314612c14d1b71efb0',
	method: 'POST',
	headers: headers,
	json: {"medium": "balance","amount": money}
}

request(options, function (error, response, body){
	if (!error && response.statusCode == 201){
		console.log(body)
	}
})

