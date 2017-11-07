var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("cli-table");
var colors = require('colors');

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
	if (err) throw err;

	// console.log("connected as id " + connection.threadId + "\n");

	startOrder();
});

function startOrder() {
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;

		var table = new Table({
			head: ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity'],
			colWidths: [10, 40, 20, 10, 18],
			style: { head: ['cyan'] },
			colAligns: [null, null, null, 'right', 'right']
		});
		 
		for(var i=0; i<res.length; i++) {
			table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
		}

		console.log(table.toString());

		checkoutOrder();
	});
}

function checkoutOrder() {
	inquirer
		.prompt([
			{
				type: "input",
				message: "What is the item number of the item you wish to purchase? ",
				validate: 
					function(value) {
						if ((isNaN(value) === false) && (value !== "")) {
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
								if ((isNaN(value) === false) && (value !== "")) {
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
							var displayMessage = "";
							if(amount > res[0].stock_quantity) {
								displayMessage = "Our apologies. We don't have enough " + res[0].product_name + " to fulfill your order.";
								console.log(displayMessage.bold.red);
								// connection.end();

								startOrder();
							}
							else
							{
								displayMessage = "We have what you need! I'll have your order right now!";
								console.log(displayMessage.bold.yellow);
								displayMessage = "Your total cost for " + amount + " " + res[0].product_name + " is " + (res[0].price * amount) + ". Thank you for your business!";
								console.log(displayMessage.bold.yellow);

								updateProductStock(item, (res[0].stock_quantity - amount));
							}
						}
						else {
							console.log("We don't have the item you choose!".bold.yellow);
							// connection.end();

							process.exit(1);
						}
					});

					// console.log(query.sql);
				}
			);
		}
	);
}

function updateProductStock(item, amount) {
	connection.query("UPDATE products SET ? WHERE ?",
		[
			{ stock_quantity: amount },
			{ item_id: item }
		],
		function(err, res) {
			if (err) throw err;

			// console.log(res.affectedRows + " products updated!\n");
			// connection.end();

			startOrder();
		}
	);
}

