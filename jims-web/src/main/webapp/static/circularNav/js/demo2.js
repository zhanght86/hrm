(function(){

	var button = document.getElementById('cn-button'),
    wrapper = document.getElementById('cn-wrapper');

    //open and close menu when the button is clicked
	var open = false;
	button.addEventListener('click', handler, false);

	function handler(){
	  if(!open){
	    this.innerHTML = "收起";
          $(button).css("left"," 90.5%");
          $(wrapper).css("left"," 92%");
	    classie.add(wrapper, 'opened-nav');
	  }
	  else{
          $(button).css("left"," 98%");
          $(wrapper).css("left"," 98%");
	    this.innerHTML = "张三";
		classie.remove(wrapper, 'opened-nav');
	  }
	  open = !open;
	}
	function closeWrapper(){
		classie.remove(wrapper, 'opened-nav');
	}

})();
