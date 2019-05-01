var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "root",
    database: "bamazon_db"
});

function forSale() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("\nCurrent Inventory:");
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        for (var i = 0; i < res.length; i++) {
            console.log("Item ID: " + res[i].item_id + " |  Product: " + res[i].product_name + " |  Price: $" + res[i].price + " |  Quantity left: " + res[i].stock_quantity + "\n");
        }
        start();
    });
};

function lowStock() {
    connection.query("SELECT item_id, product_name, stock_quantity FROM products", function (err, res) {
        if (err) throw err;
        console.log("\nLow Inventory Products:");
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 50) {
                console.log("Item ID: " + res[i].item_id + " |  Product: " + res[i].product_name + " |  Quantity left: " + res[i].stock_quantity + "\n");
            }
        }
        start();
    });
};

function addInventory() {
    console.log("\nBamazon Inventory Manager");
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    connection.query("SELECT item_id, product_name, stock_quantity FROM products", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "items",
                type: "list",
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < res.length; i++) {
                        choiceArray.push(res[i].product_name);
                    }
                    return choiceArray;
                },
                message: "To which item would you like to add inventory?"
            },
            {
                name: "units",
                type: "input",
                message: "How many units would you like to add?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function(ans) {
            connection.query("SELECT * FROM products WHERE ?", [{product_name: ans.items}], function (err, res) {
                if (err) throw err;
                var newStock = parseInt(ans.units) + parseInt(res[0].stock_quantity);
                connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: newStock}, {product_name: ans.items}], function (err, res) {
                    if (err) throw err;
                    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                    console.log(ans.items + " new stock quantity is " + newStock)
                    start();
                });
            })
        })
    });
};

function addProduct() {
    console.log("\nBamazon Product Manager");
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What is the name of the product to add?",
        },
        {
            name: "category",
            type: "input",
            message: "In what department does this product belong?",
        },
        {
            name: "price",
            type: "input",
            message: "What is the retail price of this product?",
        },
        {
            name: "stock",
            type: "input",
            message: "How many are to be added to the inventory?",
        }
    ]).then(function (ans) {
        connection.query("INSERT INTO products SET ?", {product_name: ans.name, department_name: ans.category, price: ans.price, stock_quantity: ans.stock}, function(err,res) {
            if (err) throw err;
            console.log("\nNew product added!");
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
            start();
        });
    });
};

function start() {
    console.log("\nWelcome to Bamazon Manager View");
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    inquirer.prompt([
        {
            name: "main",
            type: "list",
            choices: ["Check items for sale", "Check on low inventory", "Add to inventory", "Add a new product", "EXIT"],
            message: "What would you like to do?"
        }
    ]).then(function(ans) {
        switch(ans.main) {
            case "Check items for sale":
                forSale();
                break;
            case "Check on low inventory":
                lowStock();
                break;
            case "Add to inventory":
                addInventory();
                break;
            case "Add a new product":
                addProduct();
                break;
            default: connection.end();
        }
    });
};

start();