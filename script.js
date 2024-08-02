
//Slider

const links = document.querySelector('.toggle-Links');

function showMenu() {
    links.classList.toggle('active')
}

let indice = 1;
showSlides(indice)

function proximo(n) {
    showSlides(indice += n)
}

function showSlides(n) {
    let slides = document.getElementsByClassName('slides')

    if (n > slides.length) {
        indice = 1
    }

    if (n < 1) {
        indice = slides.length
    }

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }

    slides[indice - 1].style.display = 'flex'

}


