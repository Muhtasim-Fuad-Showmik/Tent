/*
The function func is the function being passed in here.
The function is being returned with an added catch to it
which calls the next middleware if an error is caught.
*/
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}