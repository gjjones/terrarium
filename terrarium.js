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
	for (var i = this.cells.length - 1; i >= 0; i--) {
		point.x = i % this.width;
		point.y = Math.floor(i / this.width);
		if(this.valueAt(point) !== undefined)
			action(point, this.valueAt(point))
	};
};

var testGrid = new Grid(3, 2);
testGrid.setValueAt(new Point(1, 0), "#");
testGrid.setValueAt(new Point(1, 1), "o");
testGrid.each(function(point, value) {
	console.log([point.x, ", ", point.y, ": ", value].join(""));
});
