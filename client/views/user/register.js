Template.register.events({
  'change .profile-pic': function(event, template) {
       FS.Utility.eachFile(event, function(file) {
         Images.insert(file, function (err, fileObj) {
           if (err){
              // handle error
              console.log(err);
           } else {
              // handle success depending what you need to do
             var imagesURL = "/cfs/files/images/" + fileObj._id;
              Session.set('profilePicURL', imagesURL);
           }
         });
      });
    },
  'click #register-button': function(e, t) {
     e.preventDefault();
     // Retrieve the input field values
     var email = $('#email').val(),
         firstName = $('#first-name').val(),
         lastName = $('#last-name').val(),
         name = $('#first-name').val() + ' ' + $('#last-name').val(),
         password = $('#password').val(),
         passwordAgain = $('#password-again').val();
         profilePic = Session.get('profilePicURL');
    // Trim Helper
    var trimInput = function(val) {
       return val.replace(/^\s*|\s*$/g, "");
    };
    email = trimInput(email);
    // Check password is at least 6 chars long
    var isValidPassword = function(pwd, pwd2) {
       if (pwd === pwd2) {
         return pwd.length >= 6 ? true : false;
       } else {
         return "Passwords don't match!";
       }
     };
     console.log(profilePic);
    // If validation passes, supply the appropriate fields to the
    // Accounts.createUser function.
    if (isValidPassword(password, passwordAgain)) { 
       Accounts.createUser({
           email: email,
           firstName: firstName,
           lastName: lastName,
           password: password,
           profilePic: profilePic,
           createdOn: new Date(),
      }, function(error) {
         if (error) {
            console.log("Error: " + error.reason);
         } else {
            FlowRouter.go('/');
         }
      });
    }
    return false;
  }
});