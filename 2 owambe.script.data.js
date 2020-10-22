'use strict';
/**
 * Initializes the FriendlyEats app.
 */
function FriendlyEats() {
  this.filters = {
    city: '',
    price: '',
    category: '',
    sort: 'Rating'
  };

  this.dialogs = {};

  firebase.firestore().settings({ timestampsInSnapshots: true });

  var that = this;
  firebase.auth().signInAnonymously().then(function() {
    that.initTemplates();
    that.initRouter();
    that.initReviewDialog();
    that.initFilterDialog();
  }).catch(function(err) {
    console.log(err);
  });
}
/**
 * Initializes the router for the FriendlyEats app.
 */
FriendlyEats.prototype.initRouter = function() {
  this.router = new Navigo();
  var that = this;
  this.router
    .on({
      '/': function() {
        that.updateQuery(that.filters);
      }
