const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://api.escuelajs.co/api/v1/products';

function SetNewOffset(newOffset){
  localStorage.setItem('offset', newOffset)
}

function GetOffset(){
  let newOffset = localStorage.getItem('offset')

  if (newOffset){
    newOffset = parseInt(newOffset) + 10
  } else {
      newOffset = 5
  }

  SetNewOffset(newOffset)
  return newOffset
}

const intersectionObserver = new IntersectionObserver(entries => {
  entries.forEach(image => {
    if (image.isIntersecting === true){
      image.target.src = image.target.getAttribute('data-src')
    }
  })
}, {

});

const getData = api => {
  const currentOffset = GetOffset()
  const newItem = document.createElement('section');
  newItem.classList.add('Items');

  fetch(`${api}?offset=${currentOffset}&limit=10`)
    .then(response => response.json())
    .then(response => {
      let products = response;
        console.log('Hola:', products)
      products.forEach(product => {
        // template
        const cardArticle = document.createElement('section')
        cardArticle.classList.add('Card')

        const cardImg = document.createElement('img')
        cardImg.setAttribute(intersectionObserver ? 'data-src' : 'src', product.images[1])
        cardImg.alt = product.title + ' image'

        const cardTitle = document.createElement('h2')
        cardTitle.innerText = product.title

        const cardPrice = document.createElement('small')
        cardPrice.innerText = '$' + product.price

        cardTitle.innerHTML += cardPrice

        cardArticle.append(cardImg, cardTitle)
        newItem.appendChild(cardArticle)
        intersectionObserver.observe(cardImg)
      });

      $app.appendChild(newItem);
    })
    .catch(error => console.log(error));
}

const loadData = () => {
  getData(API);
}

loadData()
intersectionObserver.observe($observe);
