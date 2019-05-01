var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "root",
    database: "bamazon_db"
});

// function readProducts() {
//     console.log("\nAvailable products:\n");
//     console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
//     connection.query("SELECT item_id, product_name, price FROM products", function (err, res) {
//         if (err) throw err;
//         for (var i = 0; i < res.length; i++) {
//             console.log(res[i].item_id + "     $" + res[i].price + "     " + res[i].product_name);
//         }
//     });
// };

function keepShopping() {
    inquirer.prompt([
        {
            type: "confirm",
            name: "confirm",
            message: "Would you like to keep shopping?"
        }
    ]).then(function (answer) {
        if (answer.confirm === true) {
            start();
        } else {
            console.log("\nThank you for shopping Bamazon, see you next time!");
            connection.end();
        };
    });
};

function start() {
    console.log("\n*** WELCOME TO BAMAZON ***");
    console.log("\nAvailable products:\n");
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    connection.query("SELECT item_id, product_name, price FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + "     $" + res[i].price + "     " + res[i].product_name);
            // console.table([res[i].item_id, "$" + res[i].price, res[i].product_name]);

        };
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

        inquirer.prompt([
            {
                name: "userID",
                type: "input",
                message: "Enter the product ID of what you would like to buy:",
                // validate: function (name) {
                //     if (isNan(name) === false) {
                //         return true;
                //     } else {
                //         return false;
                //     };
                // }
            },
            {
                name: "userUnits",
                type: "input",
                message: "How many would you like to purchase?",
                // validate: function (name) {
                //     if (isNan(name) === false) {
                //         return true;
                //     } else {
                //         return false;
                //     };
                // }
            }
        ]).then(function (ans) {
            connection.query("SELECT price, stock_quantity FROM products WHERE item_id = ?", [ans.userID], function (err, res) {
                if (err) throw err;
                var newStock = res[0].stock_quantity - ans.userUnits
                if (ans.userUnits > res[0].stock_quantity) {
                    console.log("\nWe're sorry, we don't have sufficient stock for that order.\n");
                    keepShopping();
                } else {
                    console.log("\nThank you for your purchase! Your total is $" + (res[0].price * ans.userUnits));
                    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

                    connection.query("UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: newStock
                            },
                            {
                                item_id: ans.userID
                            }
                        ], function (err, res) {
                            if (err) throw err;

                        });
                    keepShopping();
                };

            });
        });

    });
};

connection.connect(function (err) {
    if (err) throw err;
    start();
});