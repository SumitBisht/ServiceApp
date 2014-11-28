var sql = require('mssql'); 

var conn_str = {
    user: 'sa',
    password: 'root',
    server: '127.0.0.1', // You can use 'localhost\\instance' to connect to named instance
    database: 'nodedb',
}

var connection = new sql.Connection(conn_str, function(err) {

	if (err) {
		console.log("Problem In opening connection "+err);
	};
});

allData = function(req, res, render){
	var tasks = [];
	var request = new sql.Request(connection);

    request.query("SELECT id, name, description, status FROM tasks", function (err, results) {
        if (err) {
            console.error("Error running query! "+err);
            return;
        }

        results.map(function(results){
        	var task = {
	        	id: results.id,
	        	name: results.name,
	        	description: results.description,
	        	status: results.status,
	        };
	        tasks.push(task);
	    });

		if(render){
			res.render( 'tasklist', {data: tasks});
		}else{
			res.send(JSON.stringify(tasks));
		}
	});
}

addTask = function(req, res, task){
	var request = new sql.Request(connection);
    var queryString = "INSERT INTO tasks('name', 'description', 'status') VALUES ('"+
    	task.name+"', '"+task.description+"', '"+task.status+"') ";
    
    request.query(queryString, function (err, results) {
        if (err) {
            console.error("Error running query! "+err);
            return;
        }
    });
    res.send('Data inserted SuccessFully');
}
findTask = function(req, res, render) {
	var request = new sql.Request(connection);

    request.query("SELECT id, name, description, status FROM tasks WHERE id="+req.params.id, function (err, result) {
        if (err) {
            console.error("Error running query! "+err);
            return;
        }
        if(results){
        	if(render)
        		res.render('editTask', {task: result});
        	else
        		res.send(JSON.stringify(result));
        }
    });
}
updateTask = function(req, res, task){
	var request = new sql.Request(connection);
    var queryString = "UPDATE tasks SET name = '"+task.name+"', description = '"+task.description+"', status = '"+task.status+
    "' WHERE id=" + task.id;
    
    request.query(queryString, function (err, results) {
        if (err) {
            console.error("Error running query! "+err);
            return;
        }
        res.send("Updated SuccessFully");
    });
}
removeTask = function(id){
	var request = new sql.Request(connection);
    request.query("DELETE FROM tasks WHERE id="+req.params.id, function (err, results) {
        if (err) {
            console.error("Error running query! "+err);
            return;
        }
        res.send('Deleted SuccessFully');
    });
}

/* List of methods exposed as service/view
 * for the application.
 */
//Lists all the tasks in a table


exports.dataList = function(req, res){
	return allData(req, res, true);
};

//Provides all the tasks as object
exports.list = function(req, res){
	allData(req, res, false);
};
//Provides a single task object
exports.view = function(req, res){
	findTask(req, res, false);
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
	addTask(req, res, newTask);
};
//removes the provided task
exports.remove = function(req, res){
	removeTask(req.params.id);
};
//Provides a pre-populated form to update task
exports.change = function(req, res){
	findTask(req, res, true);
};
//Updates the provided task
exports.update = function(req, res){
	var updatedTask = {};
	updatedTask.id = req.params.id;
	updatedTask.name = req.body.name;
	updatedTask.description = req.body.description;
	updatedTask.status = req.body.status;
	console.log(JSON.stringify(updatedTask));
	updateTask(req, res, updatedTask);
};
