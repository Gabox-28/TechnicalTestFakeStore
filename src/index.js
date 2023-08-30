const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://api.escuelajs.co/api/v1/products';

window.addEventListener('load', () => {
  localStorage.removeItem('offset')
})

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

const lazyLoad = new IntersectionObserver(entries => {
  entries.forEach(image => {
    if (image.isIntersecting === true){
      image.target.src = image.target.getAttribute('data-src')
    }
  })
}, {});

const infinityLoad = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting === true){
    loadData()
  }
}, {rootMargin: '0px 0px 100% 0px'})

const getData = api => {
  const currentOffset = GetOffset()
  const newItem = document.createElement('section');
  newItem.classList.add('Items');

  fetch(`${api}?offset=${currentOffset}&limit=10`)
    .then(response => response.json())
    .then(response => {
      let products = response;
      if (products.length > 0){
        products.forEach(product => {
          // template
          const cardArticle = document.createElement('section')
          cardArticle.classList.add('Card')

          const cardImg = document.createElement('img')
          cardImg.setAttribute(lazyLoad ? 'data-src' : 'src', product.images[1])
          cardImg.alt = product.title + ' image'

          const cardTitle = document.createElement('h2')
          cardTitle.innerText = product.title

          const cardPrice = document.createElement('small')
          cardPrice.innerText = '$' + product.price

          cardTitle.append(cardPrice)

          cardArticle.append(cardImg, cardTitle)
          newItem.appendChild(cardArticle)
          lazyLoad.observe(cardImg)
        });
      }else{
        $observe.innerText = "Todos los productos fueron obtenidos"
        infinityLoad.unobserve($observe)
      }

      $app.appendChild(newItem);
    })
    .catch(error => console.log(error));
}

const loadData = async () => {
  await getData(API);
}

infinityLoad.observe($observe)
