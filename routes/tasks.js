
var data = [];
data.push({id:0, name:'swimming', description:'Swim atleast 4 rounds', status: 'in process'});
data.push({id:1, name:'breakfast', description:'Get the breakfast ready', status: 'to do'});
data.push({id:2, name:'teaching', description:'teach the next lesson to kids', status: 'to do'});

allData = function(){
	return data;
}
addTask = function(task){
	task.id = data.length-1;
	data.push(task);
}
findTask = function(id) {
	return data[id];
}
updateTask = function(task){
	data.splice(task.id, 1);
	data.splice(task.id, 0, task);
}
removeTask = function(id){
	data.splice(id, 1);
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
