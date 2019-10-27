var method = Space.prototype;

function Space(location) {
    this._location = location; // location is a string (B1, A6, etc.)
    this._color = "empty";
}

method.getLocation = function() {
    return this._location;
};

method.getLetter = function() {
    return this._location[0];
};

method.getNumber = function() {
    return this._location[1];
};


method.getColor = function() {
    return this._color;
};

method.setColor = function(color) {
    this._color = color;
};

method.toString = function() {
    return (this._location + ": " + this._color);
};


module.exports = Space;
