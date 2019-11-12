var method = Space.prototype;

function Space(location, color) {
    color = color || "empty";
    this.location = location; // location is a string (B1, A6, etc.)
    this.color = color;
}

method.getLocation = function() {
    return this.location;
};

method.getLetter = function() {
    return this.location[0];
};

method.getNumber = function() {
    return this.location[1];
};

method.getColor = function() {
    return this.color;
};

method.setColor = function(color) {
    this.color = color;
};

method.toString = function() {
    return (this.location + ": " + this.color);
};

module.exports = Space;
