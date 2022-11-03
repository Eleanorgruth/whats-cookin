function getData(url) {
  return fetch(url)
    .then(response => response.json())
    .catch(err => console.log('Fetch Error: ', err)) 
}

function postData(addedItemsInfo) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(addedItemsInfo),
    header: {'Content-Type': 'application/json'}
  })
  .then(response => response.json())
  .then(json => json)
  .catch(err => console.log('Fetch Error: ', err)) 

  })
}
export default getData