let cards = document.querySelector('.cards')

async function getAllListings() {
    let apiCall = await fetch('http://localhost:3003/listing/all')
    let response = await apiCall.json()
    console.log(response)

    response.forEach((listing) => {
        cards.innerHTML += `<div class='w-1/3 h-72 mx-6 my-6'><img src='${listing.image}' class='w-48 h-48 object-cover' /> <h2>${listing.title}</h2> <p>${listing.description}</p> <p>${listing.price}</p>'</div>`
    })
}

getAllListings()

async function createListing() {
    let title = document.querySelector('.title').value
    let description = document.querySelector('.description').value
    let price = document.querySelector('.price').value
    let image = document.querySelector('.image').value
    let category = document.querySelector('.category').value
    let userId = window.localStorage.getItem('id')

    let listing = {
        title: title,
        description: description,
        image: image,
        price: price,
        category: category,
        userId: userId,
    }

    let request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(listing),
    }

    let apiRequest = fetch('http://localhost:3003/listing/create', request)
    let response = await apiRequest
    console.log(response)
    if (response.status === 200) {
        console.log(response)
        window.location.href = './allListings.html'
    }
}