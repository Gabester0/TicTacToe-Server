//Is it better to do exports.solutions = ...?

const solutions = [ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6] ];

//Probably not needed
const emptyBoard =  { ...Array(9).fill(null) };


module.exports = {solutions, emptyBoard};