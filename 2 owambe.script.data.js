'use strict';

Owambe.prototype.addUser = function(data) {
  /*
    TODO: Implement adding a document
  */
var collection = firebase.firestore().collection('users');
  return collection.add(data);
};

Owambe.prototype.getAllUsers = function(renderer) {
  /*
    TODO: Retrieve list of users
  */
var query = firebase.firestore()
      .collection('users')
      .orderBy('name', 'desc')
      .limit(100);
this.getDocumentsInQuery(query, renderer);
};

Owambe.prototype.getDocumentsInQuery = function(query, renderer) {
  /*
    TODO: Render all documents in the provided query
  */
query.onSnapshot(function(snapshot) {
if (!snapshot.size) return renderer.empty(); // Display "There is nothing here".

    snapshot.docChanges().forEach(function(change) {
      if (change.type === 'removed') {
        renderer.remove(change.doc);
      } else {
        renderer.display(change.doc);
      }
    });
  });
};

Owambe.prototype.getUser = function(id) {
  /*
    TODO: Retrieve a single user
  */
return firebase.firestore().collection('users').doc(id).get();
};

Owambe.prototype.getFilteredUsers = function(filters, renderer) {
  /*
    TODO: Retrieve filtered list of users
  */
  var query = firebase.firestore().collection('users');

  if (filters.name !== 'Any') {
    query = query.where('name', '==', filters.name);
  }

  if (filters.city !== 'Any') {
    query = query.where('city', '==', filters.city);
  }

  if (filters.country !== 'Any') {
    query = query.where('country', '==', filters.country.length);
  }

  if (filters.sort === 'Rating') {
    query = query.orderBy('avgRating', 'desc');
  } else if (filters.sort === 'Reviews') {
    query = query.orderBy('numRatings', 'desc');
  }

  this.getDocumentsInQuery(query, renderer);
};

Owambe.prototype.addRating = function(userID, rating) {
  /*
    TODO: Retrieve add a rating to users
  */
  var collection = firebase.firestore().collection('users');
  var document = collection.doc(userID);
  var newRatingDocument = document.collection('ratings').doc();

  return firebase.firestore().runTransaction(function(transaction) {
    return transaction.get(document).then(function(doc) {
      var data = doc.data();

      var newAverage =
          (data.numRatings * data.avgRating + rating.rating) /
          (data.numRatings + 1);
      
      transaction.update(document, {
        numRatings: data.numRatings + 1,
        avgRating: newAverage
      });
      return transaction.set(newRatingDocument, rating);
    });
  });
};
