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

const getData = api => {
  const currentOffset = GetOffset()

  fetch(`${api}?offset=${currentOffset}&limit=10`)
    .then(response => response.json())
    .then(response => {
      let products = response;
        console.log('Hola:', products)
      let output = products.map(product => {
        // template
      });
      let newItem = document.createElement('section');
      newItem.classList.add('Item');
      newItem.innerHTML = output;
      $app.appendChild(newItem);
    })
    .catch(error => console.log(error));
}

const loadData = () => {
  getData(API);
}

const intersectionObserver = new IntersectionObserver(entries => {
  // logic...
}, {
  rootMargin: '0px 0px 100% 0px',
});

loadData()
intersectionObserver.observe($observe);
