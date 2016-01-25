// this is image_share.js
Images = new Mongo.Collection("images");

if (Meteor.isClient) {

  Accounts.ui.config({
    requestPermissions: {
      // facebook: ['user_likes']
    },
    requestOfflineToken: {
      // google: true
    },
    passwordSignupFields: 'USERNAME_AND_EMAIL' //  One of 'USERNAME_AND_EMAIL', 'USERNAME_AND_OPTIONAL_EMAIL', 'USERNAME_ONLY', or 'EMAIL_ONLY' (default).
  });

  Template.body.helpers({
    username: function() {
      if (Meteor.user()) {
        return Meteor.user().username;
      } else {
        return 'anonymous';
      }
    }
  });

 Template.images.helpers({

  images: function() {
    if (Session.get("userFilter")) { //they set a filter!
      console.log('asdasd');
      return Images.find({addedBy: Session.get('userFilter')}, {sort:{addedOn: -1, rating:-1}});
    } else {
      console.log('esle');
      return Images.find({}, {sort:{addedOn: -1, rating:-1}});
    }
  },
  getUser: function(user_id) {
    var user = Meteor.users.findOne({_id: user_id});
    if (user) {
      return user.username;
    } else {
      return 'anonymous';
    }
  }
});

 Template.images.events({
  'click .js-image':function(event){
    $(event.target).css("width", "50px");
  }, 
  'click .js-del-image': function (event) {
    var image_id = this._id;
    console.log(image_id);
    $('#'+image_id).hide('slow', function() {
      Images.remove({"_id": image_id});
    });
  },
  'click .js-rate-image' : function (event) {
    var rating = $(event.currentTarget).data('userrating');
    var image_id = this.id;
    console.log(image_id);

    Images.update({_id: image_id},
      {$set: {rating: rating}}
      );
  },
  'click .js-show-image-form':function(event){
    $('#image_add_form').modal('show');
  }, 

  'click .js-set-image-filter' : function(event) {
    Session.set("userFilter", this.addedBy);
  }

});

 Template.image_add_form.events({
  'submit .js-add-image' : function(event) {
    var img_src, img_alt;
    img_src = event.target.img_src.value;
    img_alt = event.target.img_alt.value;
    if (Meteor.user()) {
      Images.insert({
        img_src : img_src,
        img_alt: img_alt,
        addedOn: new Date(),
        addedBy: Meteor.user()._id
      });
    }
    
    return false;
  }
});



}

