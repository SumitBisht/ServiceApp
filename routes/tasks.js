/*var sql = require('node-sqlserver');
*//*var conn_str = "Driver={SQL Server Native Client 11.0};Server=(local);Database=AdventureWorks2012;Trusted_Connection={Yes}";
*/
var sql = require('mssql'); 



var conn_str = {
    user: 'sa',
    password: 'root',
    server: '127.0.0.1', // You can use 'localhost\\instance' to connect to named instance
    database: 'nodedb',

    options: {
       // encrypt: true // Use this if you're on Windows Azure
    }
}



var connection = new sql.Connection(conn_str, function(err) {


	if (err) {
		console.log("Problem In opening connection "+err);
	};
});


allData = function(){
	var tasks = [];
	var request = new sql.Request(connection);
	
	    request.query("SELECT id, name, description, status FROM tasks", function (err, results) {
	        if (err) {
	            console.error("Error running query! "+err);
	            return;
	        }

results.map(function(results){


console.dir("Hello Raaz"+results.id);

var task = {
	        		id: results.rows[i][0],
	        		name: results.rows[i][1],
	        		description: results.rows[i][2],
	        		status: results.rows[i][3],
	        	};
	        	tasks.push(task);
});
/* return tasks;*/

/*	        console.dir("Hello Raaz"+results.id);
*/	       /* for (var i = 0; i < results.rows.length; i++) {
	        	var task = {
	        		id: results.rows[i][0],
	        		name: results.rows[i][1],
	        		description: results.rows[i][2],
	        		status: results.rows[i][3],
	        	};
	        	tasks.push(task);
	        }*/
	        return tasks;
	    });
	
}
/*
addTask = function(task){
	sql.open(conn_str, function (err, conn) {
	    if (err) {
	        console.error("Error opening the connection! "+err);
	        return;
	    }
	    var queryString = "INSERT INTO Tasks.Tasks('name', 'description', 'status') VALUES ('"+
	    	task.name+"', '"+task.description+"', '"+task.status+"') ";

	    conn.queryRaw(queryString, function (err, results) {
	        if (err) {
	            console.error("Error running query! "+err);
	            return;
	        }
	        return tasks;
	    });
	});
}
findTask = function(id) {
	sql.open(conn_str, function (err, conn) {
	    if (err) {
	        console.error("Error opening the connection! "+err);
	        return;
	    }
	    conn.queryRaw("SELECT id, name, description, status FROM Tasks.Tasks where id="+id, function (err, results) {
	        if (err) {
	            console.error("Error running query! "+err);
	            return;
	        }
        	var task = {
        		id: results.rows[0][0],
        		name: results.rows[0][1],
        		description: results.rows[0][2],
        		status: results.rows[0][3],
        	};
	        return tasks;
	    });
	});
}
updateTask = function(task){
	sql.open(conn_str, function (err, conn) {
	    if (err) {
	        console.error("Error opening the connection! "+err);
	        return;
	    }
	    var queryString = "UPDATE Tasks.Tasks SET name = '"+task.name+"', description = '"+task.description+"', status = '"+task.status+
	    "' WHERE id=" + task.id;

	    conn.queryRaw(queryString, function (err, results) {
	        if (err) {
	            console.error("Error running query! "+err);
	            return;
	        }
	    });
	});
}
removeTask = function(id){
	sql.open(conn_str, function (err, conn) {
	    if (err) {
	        console.error("Error opening the connection! "+err);
	        return;
	    }
	    var queryString = "DELETE FROM Tasks.Tasks WHERE id=" + task.id;

	    conn.queryRaw(queryString, function (err, results) {
	        if (err) {
	            console.error("Error running query! "+err);
	            return;
	        }
	    });
	});
}

/* List of methods exposed as service/view
 * for the application.
 */
//Lists all the tasks in a table
exports.dataList = function(req, res){
	res.render( 'tasklist', {data: allData()});
};
//Provides all the tasks as object
exports.list = function(req, res){
	res.send(allData());
};
//Provides a single task object
exports.view = function(req, res){
	res.send(findTask(req.params.id));
}
//Provides a view to add new task
exports.new = function(req, res){
	res.render('newTask');
};
//Adds the new task to existing task list
exports.add = function(req, res){
	var newTask = {};
	newTask.name = req.body.name;
	newTask.description = req.body.description;
	newTask.status = req.body.status;
	addTask(newTask);
	res.send('Posted Successfully');
};
//removes the provided task
exports.remove = function(req, res){
	removeTask(req.params.id);
	res.redirect("/");
};
//Provides a pre-populated form to update task
exports.change = function(req, res){
	var oldModel = findTask(req.params.id);
	res.render('editTask', {task: oldModel});
};
//Updates the provided task
exports.update = function(req, res){
	var updatedTask = {};
	updatedTask.id = req.params.id;
	updatedTask.name = req.body.name;
	updatedTask.description = req.body.description;
	updatedTask.status = req.body.status;
	console.log(JSON.stringify(updatedTask));
	updateTask(updatedTask);
	res.send('Updated Successfully');
};
