//constants for room creation
const min_players = 2;
const max_players = 4;
const kills_min = 1;
const kills_max = 10;
const map_min = 1;
const map_max = 1;


// shameless copied from http://stackoverflow.com/a/1830844
function isNumeric(n) {
  return !Number.isNaN(parseFloat(n)) && Number.isFinite(n);
}

// shamelessly copied from http://stackoverflow.com/a/1349462
function randomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}

// check that all the supplied room creation settings are valid
function checkSettings(tocheck) {
	if (!("required_players" in tocheck && isNumeric(tocheck["required_players"]))) return false;
	if (!("required_kills" in tocheck && isNumeric(tocheck["required_kills"]))) return false;
	if (!("map_num" in tocheck && isNumeric(tocheck["map_num"]))) return false;

	if (tocheck["required_players"] < min_players || tocheck["required_players"] > max_players) return false;
	if (tocheck["required_kills"] < kills_min || tocheck["required_kills"] > kills_max) return false;
	if (tocheck["map_num"] < map_min || tocheck["map_num"] > map_max) return false;

	return true;
}

//return the JSON object which represents the starting state of the new user
function createUserState(socket, map_num, required_players) {
	//TODO:
}

module.exports = {
	randomString,
	checkSettings,
	createUserState
}