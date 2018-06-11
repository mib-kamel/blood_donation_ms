/**
 * DonorsController.js
 * This controller handle all donors server requests,
 * The config/routes.js redirects the url to the right function.
 * Note that we use the db by calling sails js model function (find, create, update and destroy)
 */

module.exports = {

    //Get the nearest donors in the specified range betweem min & max latitudes and min & max longitudes
    //if the request is socket request it makes the sender subscribe to the returned donors updates.
    getDonorsBySocket: function(request, response) {
        //make sure that the range is found
        if (request.body.maxLat !== undefined && request.body.minLat !== undefined && request.body.maxLng !== undefined && request.body.minLng !== undefined) {
            //find all donors and filter them to return those who are in the range
            Donors.find({}, (error, result) => {
                var nearDonors = result.filter(donor =>
                    donor.lat < request.body.maxLat &&
                    donor.lat > request.body.minLat &&
                    donor.lng < request.body.maxLng &&
                    donor.lng > request.body.minLng
                )
                //if the request is socket request it makes the sender subscribe to the returned donors updates.
                if (request.isSocket === true) {
                    Donors.subscribe(request.socket, nearDonors);
                }
                response.send(nearDonors)
            })
        } else {
            response.send("invalid data")
        }
    },

    //Check the received donor data and if valid create a new one in the db 
    createNewDonor: function(request, response) {
        //The second paramter is true which means that the check is for create request
        if (validDonorData(request.body, true)) {
            //valid data checking passed then create the donorData object from the request body
            var donorData = {
                firstName: request.body.firstName,
                lastName: request.body.lastName,
                mail: request.body.mail,
                phone: request.body.phone,
                bloodGroup: request.body.bloodGroup,
                ip: request.ip,
                lng: request.body.lng,
                lat: request.body.lat
            }

            //Create in the database and if no errors return the new created donr id
            Donors.create(donorData, (error, result) => {
                if (error) response.send("error");
                else {
                    response.send({ id: result.id });
                }
            })
        } else {
            response.send("invalid data")
        }
    },

    //update a donor
    updateDonor: function(request, response) {
        //Check that the wanted data are here and valid
        if (validDonorData(request.body) && request.params.id !== undefined) {
            var donorData = {
                firstName: request.body.firstName,
                lastName: request.body.lastName,
                mail: request.body.mail,
                phone: request.body.phone,
                bloodGroup: request.body.bloodGroup,
                ip: request.ip
            }
            Donors.update({ id: request.params.id }, donorData, (error, result) => {
                if (error) response.send("error");
                else {
                    if (result.length > 0) {
                        //Publish the update to all this donor subscribers
                        Donors.publishUpdate(result[0].id, result[0])
                        response.send("updated");
                    } else {
                        response.send("invalid id")
                    }
                }
            })
        } else {
            response.send("invalid data")
        }
    },

    //Delete a donor by its id
    deleteDonor: function(request, response) {
        if (request.params.id !== undefined) {
            Donors.destroy({ id: request.params.id }, (error, result) => {
                if (error) response.send("error");
                else {
                    //Publish that to all this donor subscribers
                    Donors.publishDestroy(result[0].id)
                    response.send("deleted");
                }
            })
        } else {
            response.send("invalid data")
        }
    }
};

// a function to check if the donor data is valid
// we use this function before create and update
// because the create check is not like the update one we wait isCreate to be true if the caller is the create function
var validDonorData = (data, isCreate) => {
    var isValid = true;
    if (data.firstName === undefined || data.lastName === undefined || data.mail === undefined ||
        data.bloodGroup === undefined || data.phone === undefined || (data.lat === undefined && isCreate) || (data.lng === undefined && isCreate)) isValid = false;
    
    //the first and last name must be between (3-30) english characters
    isValid = isValid && /^[a-zA-Z ]{3,30}$/.test(data.firstName) && /^[a-zA-Z ]{3,30}$/.test(data.lastName);

    //mail validation (ex: abc@y.co)
    isValid = isValid && /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(data.mail);

    //the phone number must be 00xx xxx xxx xxxx xxx or +xx xxx xxxx xxx
    isValid = isValid && /^(00|\+)[0-9]{2}\s[0-9]{3}\s[0-9]{4}\s[0-9]{3}$/.test(data.phone);

    return isValid;
}

