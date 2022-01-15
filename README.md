# YelpCamp

This project is a website about campgrounds , where users can browse campgrounds located in their areas , can give reviews about different campgrounds , campground owners can create new campgrounds and can delete created campgrounds.

This Project is build using Javascript for frontend and Node.js and it's frame works for backend.
MongoDB is used as the Database.

There are 5 main pages:
Landing page: This page is the home page.
Login page: This is the Login page.
Sign Up page: This is the register/signup page.
Index page: This is the page to show all the campgrounds in the database along with a cluster map.
Show page: This page shows details of a particular campground from here you can add reviews, edit and delete a campground if you are authorized.
New page: This page is used to create a new campground.


Authorization is taken into account while giving rights to a user to edit or delete a campground.
Only the user who had made a particular campground can delete or edit that campground.

Authentication is also taken into account while creating a new campground and while adding comments( a user can perform these activities if he/she is logged in).
