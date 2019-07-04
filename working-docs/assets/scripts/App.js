require('waypoints/lib/noframework.waypoints.min');

//select all element with class of reveal-item
const portfolio = document.querySelector('.reveal-profile-portfolio');
if(portfolio){
  
    //execute waypoint
    new Waypoint({
      element: portfolio,
      handler: function(direction) {
        if(direction === 'down'){
          this.element.classList.add('reveal-profile-portfolio-visible');
        }
      },
      offset:"90%"
    });
  
}
//select all element with class of reveal-item
const profile = document.querySelector('.reveal');
if(profile){
  
    //execute waypoint
    new Waypoint({
      element: profile,
      handler: function(direction) {
        if(direction === 'down'){
          this.element.classList.add('reveal-visible');
        }
      },
      offset:"90%"
    });
  
}
