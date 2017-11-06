var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	// Your username
	user: "root",
	// Your password
	password: "bootcamp",
	database: "bamazon"
});

connection.connect(function(err) {
	if (err) console.log("Error: " + err);

	// console.log("connected as id " + connection.threadId + "\n");

	processOrder();
});

function processOrder() {
	inquirer
		.prompt([
			{
				type: "input",
				message: "What is the item number of the item you wish to purchase? ",
				validate: 
					function(value) {
						if (isNaN(value) === false) {
							return true;
						}
						return false;
					},
				name: "item"
			}
		]).then(function(resp1) {
			var item = parseInt(resp1.item);

			inquirer
				.prompt([
					{
						type: "input",
						message: "How many would you like to buy? ",
						validate: 
							function(value) {
								if (isNaN(value) === false) {
									return true;
								}
								return false;
							},
						name: "amount"
					}
				]).then(function(resp2) {
					var amount = parseInt(resp2.amount);

					var query = connection.query("SELECT * FROM products WHERE ?", { item_id: item }, function(err, res) {
						if (err) throw err;
						
						if(res.length > 0) {
							if(amount > res[0].stock_quantity) {
								console.log("Our apologies. We don't have enough " + res[0].product_name + " to fulfill your order.");
								connection.end();
							}
							else
							{
								console.log("We have what you need! I'll have your order right now!");
								console.log("Your total cost for " + amount + " " + res[0].product_name + " is " + (res[0].price * amount) + ". Thank you for your business!");
								updateProductStock(item, (res[0].stock_quantity - amount));
							}
						}
						else {
							connection.end();
						}
					});

					// console.log(query.sql);
				});
		});
}

function updateProductStock(item, amount) {
	connection.query("UPDATE products SET ? WHERE ?",
		[
			{ stock_quantity: amount },
			{ item_id: item }
		],
		function(err, res) {
			// console.log(res.affectedRows + " products updated!\n");
			connection.end();
		}
	);
}

