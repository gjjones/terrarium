function forEachIn(object, action) {
	for (var property in object) {
		if (Object.prototype.hasOwnProperty.call(object, property))
			action(property, object[property]);
	}
}

function Dictionary(startValues) {
	this.values = startValues || {};
}
Dictionary.prototype.store = function(names, values) {
	this.values[name] = value;
};
Dictionary.prototype.lookup = function(name) {
	return this.values[name];
};
Dictionary.prototype.contains = function(name) {
	return Object.prototype.hasOwnProperty.call(this.values, name) &&
			Object.prototype.propertyIsEnumerable.call(this.values, name);
};
Dictionary.prototype.each = function(action) {
	forEachIn(this.values, action);
};



var thePlan =
  ["############################",
   "#      #    #      o      ##",
   "#                          #",
   "#          #####           #",
   "##         #   #    ##     #",
   "###           ##     #     #",
   "#           ###      #     #",
   "#   ####                   #",
   "#   ##       o             #",
   "# o  #         o       ### #",
   "#    #                     #",
   "############################"];

function Point(x, y) {
	this.x = x;
	this.y = y;
}
Point.prototype.add = function(other) {
	return new Point(this.x + other.x, this.y + other.y);
};
Point.prototype.isEqualTo = function(other) {
	return this.x === other.x && this.y === other.y;
};

// console.log(new Point(1, 4).add(new Point(4, 1)));


function Grid(width, height) {
	this.width = width;
	this.height = height;
	this.cells = new Array(width * height);
}
Grid.prototype.valueAt = function(point) {
	return this.cells[point.y * this.width + point.x];
};
Grid.prototype.setValueAt = function(point, value) {
	this.cells[point.y * this.width + point.x] = value;
};
Grid.prototype.isInside = function(point) {
	return point.x >= 0 && point.y >= 0 &&
		   point.x < this.width && point.y < this.height;
};
Grid.prototype.moveValue = function(from, to) {
	this.setValueAt(to, this.valueAt(from));
	this.setValueAt(from, undefined);
};
Grid.prototype.each = function(action) {
	var point = new Point(0, 0);
	for (var y = 0; y < this.height; ++y) {
		for (var x = 0; x < this.width; ++x) {
			point.x = x;
			point.y = y;

			action(point, this.valueAt(point))
		}
	}
};

// var testGrid = new Grid(3, 2);
// testGrid.setValueAt(new Point(1, 0), "#");
// testGrid.setValueAt(new Point(1, 1), "o");
// testGrid.each(function(point, value) {
// 	console.log([point.x, ", ", point.y, ": ", value].join(""));
// });


var directions = new Dictionary({
	"n":  new Point( 0, -1),
	"ne": new Point( 1, -1),
	"e":  new Point( 1,  0),
	"se": new Point( 1,  1),
	"s":  new Point( 0,  1),
	"sw": new Point(-1,  1),
	"w":  new Point(-1,  0),
	"nw": new Point(-1, -1),
});

//console.log(new Point(4, 4).add(directions.lookup("se")));


function StupidBug() {};
StupidBug.prototype.act = function(surroundings) {
	return {type: "move", direction: "s"};
};

var wall = {};

function Terrarium(plan) {
	var grid = new Grid(plan[0].length, plan.length);
	for (var y = 0; y < plan.length; y++) {
		var line = plan[y];
		for (var x = 0; x < line.length; x++) {
			grid.setValueAt(new Point(x, y),
				elementFromCharacter(line.charAt(x)));
		};
	};
	this.grid = grid;
}

function elementFromCharacter(character) {
	if (character == " ") 
		return undefined;
	else if (character == "#")
		return wall;
	else if (character == "o")
		return new StupidBug();
}

wall.character = "#";
StupidBug.prototype.character = "o";

function characterFromElement(element) {
	if (element == undefined)
		return " ";
	else
		return element.character;
}

// console.log(characterFromElement(wall));
// console.log(characterFromElement());
// console.log(characterFromElement(new StupidBug()));


Terrarium.prototype.toString = function() {
	var output = [];
	var endOfLine = this.grid.width - 1;
	this.grid.each(function(point, value) {
		output.push(characterFromElement(value));
		if (point.x == endOfLine)
			output.push("\n");
	})
	return output.join("");
};

var terrarium = new Terrarium(thePlan);
console.log(terrarium.toString());


Terrarium.prototype.listActingCreatures = function() {
	var found = [];
	this.grid.each(function(point, value) {
		if (value != undefined && value.act)
			found.push({object: value, point: point});
	});
	return found;
};


Terrarium.prototype.listSurroundings = function(origin) {
	var result = {};

	var grid = this.grid;
	directions.each(function(direction, offset) {
		var point = origin.add(offset);
		if (grid.isInside(point))
			result[direction] = characterFromElement(grid.valueAt(point));
		else
			result[direction] = "#";
	});

	return result;
};

console.log(terrarium.listSurroundings(new Point(1, 1)));
