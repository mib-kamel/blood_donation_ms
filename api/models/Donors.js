/**
 * Donors.js model
 *
 * @description :: Model class methods are functions built into the model itself that perform a particular task 
 * on its instances (records). This is where you will find the familiar CRUD methods for performing database
 * operations like .create(), .update(), .destroy(), .find(), etc
 */

module.exports = {
  //In sails js it always save the createdAt and updatedAt times in the db which we don't want'
  autoCreatedAt: false,
  autoUpdatedAt: false
};

