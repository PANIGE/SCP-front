var slider_img = document.querySelector('.slider-img');
var images = ['images/1.png', 'images/2.png', 'images/3.png', 'images/4.png', 'images/5.png','images/6.png','images/7.png','images/8.png'];
var i = 0;

function prev(){
	if(i <= 0) i = images.length;	
	i--;
	return setImg();			 
}

function next(){
	if(i >= images.length-1) i = -1;
	i++;
	return setImg();			 
} 

function setImg(){
	return slider_img.setAttribute('src', images[i]);
	
}