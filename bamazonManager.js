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

	startManage();
});

function startManage() {
	inquirer
		.prompt([
			{
				type: "list",
				message: "Select one of menu options: ",
				choices: [ "View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product" ],
				name: "option"
			}
		]).then(function(resp) {
			// console.log(resp.option);

			switch(resp.option) {
				case "View Products for Sale":
					viewProductsForSale();
					break;
				case "View Low Inventory":
					viewLowInventory();
					break;
				case "Add to Inventory":
					addToInventory();
					break;
				case "Add New Product":
					addNewProduct();
					break;
				default:
					console.log("Invalid Option!".bold.yellow);
					process.exit(1);
			}
		}
	);
}

function viewProductsForSale() {
	connection.query("SELECT * FROM products WHERE stock_quantity > 0", function(err, res) {
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

		startManage();
	});
}

function viewLowInventory() {
	connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
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

		startManage();
	});	
}

function addToInventory() {
	inquirer
		.prompt([
			{
				type: "input",
				message: "What is the item number of the item you add more? ",
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
						message: "How many would you like to add? ",
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
					var querySQL = "UPDATE products SET stock_quantity = stock_quantity + " + amount + " WHERE ?";

					connection.query(querySQL, { item_id: item },
						function(err, res) {
							if (err) throw err;

							// console.log(res.affectedRows + " products updated!\n");

							startManage();
						}
					);
				}
			);
		}
	);
}

function addNewProduct() {
	inquirer
		.prompt([
			{
				type: "input",
				message: "Name of a new product: ",
				name: "name"
			},
			{
				type: "input",
				message: "Department of a new product: ",
				name: "department"
			},
			{
				type: "input",
				message: "Price of a new product: ",
				validate: 
					function(value) {
						if ((isNaN(value) === false) && (value !== "")) {
							return true;
						}
						return false;
					},				
				name: "price"
			},
			{
				type: "input",
				message: "Quantity of a new product: ",
				validate: 
					function(value) {
						if ((isNaN(value) === false) && (value !== "")) {
							return true;
						}
						return false;
					},				
				name: "quantity"
			}			
		]).then(function(resp) {
			connection.query(
				"INSERT INTO products SET ?",
				{
					product_name: resp.name,
					department_name: resp.department,
					price: resp.price,
					stock_quantity: resp.quantity
				},
				function(err, res) {
					if (err) throw err;

					// console.log(res.affectedRows + " product inserted!\n");

					startManage();
				}
			);
		}
	);
}

