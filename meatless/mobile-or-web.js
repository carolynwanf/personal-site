function changeDisplay() {
    const display = document.querySelector("[class='web-image']").style.display;
    var mobileImages = document.querySelectorAll("[class='mobile-image']"),
    webImages = document.querySelectorAll("[class='web-image']"), 
    webName = document.querySelector("[class='web-name']"),
    mobileName = document.querySelector("[class='mobile-name']"),
    toggleButton = document.querySelector("[class='toggle-button']");


    if (display == 'none') {

        webName.style.display= 'none';
        mobileName.style.display= 'block';

        fadeIn(toggleButton)
        
        console.log(display)
        for (let i=0; i<mobileImages.length;i++) {
            mobileImages[i].style.display = 'none';
            webImages[i].style.opacity = '0%'
            webImages[i].style.display = 'block';
            fadeIn(webImages[i]);
            
        }
    } else {

        mobileName.style.display= 'none';
        webName.style.display= 'block';
       

        fadeIn(toggleButton);

        for (let i=0; i<mobileImages.length;i++) {
            webImages[i].style.display = 'none';
            mobileImages[i].style.opacity = '0%';
            mobileImages[i].style.display = 'block';
            fadeIn(mobileImages[i])
            
        }
    }
    
}

function fadeIn(elem) {
    let id = null;
    let opacity = 0;
    clearInterval(id);
    id = setInterval(frame, 3);
    function frame() {
      if (opacity == 100) {
        clearInterval(id);
      } else {
        opacity++;
        elem.style.opacity = opacity + '%';
      }
    }
}