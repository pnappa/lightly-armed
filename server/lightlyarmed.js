
/*
 * Server settings
 */
const port = 3000;
// client broadcasts
const updateDelay 	= 1000.0/30;
const roomNameLen 	= 5;
//num seconds after all joined before match begins (must be integer)
const startDelay 	= 5;

const io 		= require('socket.io').listen(port);
const Promise 	= require('bluebird');	 

const utils 	= require('./utils');

// object to hold the contents of all users connected, states and such
var roomStates = {};

// register the routes to the client
io.on('connection', (socket) => {

	// room controls
	socket.on('create_room', (settings) => {
		// invalid room settings? 
		if (!checkSettings(settings)) {
			console.log("invalid settings");
			socket.emit("invalid");
			return;
		}

		// generate a unique room id
		do {
			var rid = utils.randomString(roomNameLen);
		} while (!(roomStates["rooms"][rid] === undefined));
		roomStates["rooms"][rid] = {};

		// add the current user to the namespace of the room
		roomStates["rooms"][rid]["connected"] = [utils.createUserState(socket, settings["map_num"], settings["required_players"])];

		roomStates["rooms"][rid]["settings"] = settings;

		roomStates["rooms"][rid]["interval_id"] = setInterval(() => {serverWaiting(rid);}, updateDelay);

		// join the namespace for the socket
		socket.join(rid);
		// inform the client so they know the room id
		socket.emit('room_id', rid);
	});

	socket.on('join_room', (room_id) => {
		// check if the room doesn't exist
		if (roomStates["rooms"][room_id] === undefined) {
			console.log("socket " + socket + "attempted to join room: " + room_id);
			socket.emit("invalid");
		}

		//add user to the list in the room state
		let map_num = roomStates["rooms"][room_id]["settings"]["map_num"];
		let req_players = roomStates["rooms"][room_id]["settings"]["required_players"];
		roomStates["rooms"][room_id]["connected"].push(utils.createUserState(socket, map_num, req_players);
		//join the namespace
		socket.join(room_id);

		socket.emit("joined_room");
	});

	socket.on('disconnect', () => {
		//TODO:
		// find the room that the user is connected to

		// broadcast a message to close them

		// delete the room from the room states

		// remove the update loop
	});

	// game controls
	socket.on('action', (data) => {
		//TODO:
		//MEGA TODO:

	});
});

// waiting for users to join the game
function serverWaiting(room_id) {
	let reqP = roomStates["rooms"][room_id]["settings"]["required_players"];
	let curP = roomStates["rooms"][room_id]["connected"].length;
	// can we start?
	if (reqP === curP) {
		io.to(room_id).emit('room_full');
		clearInterval(roomStates["rooms"][room_id]["interval_id"]);

		// once everyone's joined, alert everyone the match will start in startDelay
		roomStates["rooms"][room_id]["interval_id"] = null;
		setTimeout(() => {countDown(room_id, startDelay);}, updateDelay);
	} else {
		// let everyone else know how many we have waiting
		io.to(room_id).emit('players_waiting', {"required": reqP, "current": curP});
	}
}

// send a message every second to alert users of when the server starts
function countDown(room_id, count) {
	if (count === 0) {
		io.to(room_id).emit('count', {'count': count});
		roomStates["rooms"][room_id]["interval_id"] = setInterval(() => {serverUpdate(room_id);}, updateDelay);
	} else {
		io.to(room_id).emit('count', {'count': count});
		setTimeout(() => {countDown(room_id, count-1);}, 1000);
	}
}


// send the state update to all users in this room
function serverUpdate(room_id) {
	//TODO:

	// waiting for users ...

	// game in progress ..
}
