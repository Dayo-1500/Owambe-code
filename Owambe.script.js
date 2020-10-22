'use strict';

/**
 * Initializes the Owambe app.
 */
function Owambe() {
  this.filters = {
    city: '',
    name: '',
    country: '',
    sort: 'Rating'
  };

  this.dialogs = {};

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
 * Initializes the router for the Owambe app.
 */
Owambe.prototype.initRouter = function() {
  this.router = new Navigo();

  var that = this;
  this.router
    .on({
      '/': function() {
        that.updateQuery(that.filters);
      }
    })
    .on({
      '/setup': function() {
        that.viewSetup();
      }
    })
    .on({
      '/users/*': function() {
        var path = that.getCleanPath(document.location.pathname);
        var id = path.split('/')[2];
        that.viewUser(id);
      }
    })
    .resolve();

  firebase
    .firestore()
    .collection('users')
    .limit(1)
    .onSnapshot(function(snapshot) {
      if (snapshot.empty) {
        that.router.navigate('/setup');
      }
    });
};

Owambe.prototype.getCleanPath = function(dirtyPath) {
  if (dirtyPath.startsWith('/index.html')) {
    return dirtyPath.split('/').slice(1).join('/');
  } else {
    return dirtyPath;
  }
};

Owambe.prototype.getFirebaseConfig = function() {
  return firebase.app().options;
};

Owambe.prototype.getRandomItem = function(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

Owambe.prototype.data = {
  words: [
    'Charity',
    'Fund raising',
    'Give',
    'Donate',
    'Paliative',
    'Crowd fund',
    'Help',
    'Outreach',
    'Hunger\''
  ],
  cities: [
    'Abuja',
    'Accra',
    'Addis Ababa',
    'Antananarivo',
    'Bamako',
    'Brazzaville',  
    'Bujumbura',
    'Conakry',
    'Gaborone',
    'Harare',
    'Kampala',
    'Khartoum',
    'Kigali',
    'Kinshasa',
    'Lusaka',
    'Maputo',
    'Mogadishu',
    'Nairobi',
    'NDjamena',
    'Nouakchott',
    'Rabat',
    'Windhoek'
  ],
  countries: [
    'Angola',
    'Burundi',
    'Botswana',
    'Congo',
    'Chad',
    'Ethiopia',
    'Ghana',
    'Guinea',
    'Kenya',
    'Madagascar',
    'Mali',
    'Mauritania',
    'Morocco',
    'Namibia',
    'Nigeria',
    'Rwanda',
    'Somalia'
    'Swaziland',
    'Zambia',
    'Zimbabwe'
  ],
  ratings: [
    {
      rating: 1,
      text: 'Would never eat here again!'
    },
    {
      rating: 2,
      text: 'Not my cup of tea.'
    },
    {
      rating: 3,
      text: 'Exactly okay :/'
    },
    {
      rating: 4,
      text: 'Actually pretty good, would recommend!'
    },
    {
      rating: 5,
      text: 'This is my favorite place. Literally.'
    }
  ]
};

window.onload = function() {
  window.app = new Owambe();
};
